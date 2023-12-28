import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUp from './Register.jsx';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

jest.mock('../contexts/AuthContext', () => ({
	useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
	useNavigate: jest.fn(),
}));

describe('SignUp Component', () => {
	const mockSignup = jest.fn();
	useAuth.mockReturnValue({
		signup: mockSignup,
	});

	beforeEach(() => {
		render(<SignUp />, { wrapper: BrowserRouter });
	});

	test('renders SignUp component with all fields', () => {
		expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
		fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByLabelText(/password confirmation/i), {
			target: { value: 'password123' },
		});
		expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
	});

	test('handles form submission', async () => {
		fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
		fireEvent.change(screen.getByLabelText(/email address/i), {
			target: { value: 'test@email.com' },
		});
		fireEvent.change(screen.getAllByLabelText(/password/i)[0], {
			target: { value: 'password123' },
		});
		fireEvent.change(screen.getByLabelText(/password confirmation/i), {
			target: { value: 'password123' },
		});

		fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

		await waitFor(() => {
			expect(mockSignup).toHaveBeenCalledWith('test@email.com', 'password123', 'testuser');
		});
	});
});
