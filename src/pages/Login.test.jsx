import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SignIn from './Login.jsx';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';

const mockLogin = jest.fn();
jest.mock('../contexts/AuthContext.jsx', () => ({
	useAuth: () => ({
		login: mockLogin,
	}),
}));
jest.mock('react-router-dom', () => ({
	useNavigate: () => jest.fn(),
}));

describe('SignIn Component', () => {
	beforeEach(() => {
		render(<SignIn />, { wrapper: BrowserRouter });
		mockLogin.mockClear();
	});

	test('renders SignIn component', () => {
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
	});

	test('allows the user to enter email and password', () => {
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
		expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
		expect(screen.getByLabelText(/password/i).value).toBe('password123');
	});

	test('handles submit button click', () => {
		fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
	});

	test('correct user login', async () => {
		mockLogin.mockResolvedValueOnce();
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test123@gmail.com' } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'test123' } });
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
		});
		await waitFor(() => expect(mockLogin).toHaveBeenCalledWith('test123@gmail.com', 'test123'));
	});

	test('user login incorrect', async () => {
		mockLogin.mockRejectedValueOnce(new Error('Failed to sign in'));
		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: 'wrongemail@example.com' },
		});
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
		});
		await waitFor(() => expect(screen.getByText('Failed to sign in')).toBeInTheDocument());
	});

	test('an attempt to log in without completing one of the fields', async () => {
		fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
		fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'test123' } });
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
		});
		expect(mockLogin).not.toHaveBeenCalled();
	});
});
