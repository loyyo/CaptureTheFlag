import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import SignIn from './Login.jsx'
import '@testing-library/jest-dom';
import {BrowserRouter} from 'react-router-dom';

jest.mock('../contexts/AuthContext.jsx', () => ({
    useAuth: () => ({
        login: jest.fn()
    })
}));
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn()
}));

describe('SignIn Component', () => {
    beforeEach(() => {
        render(<SignIn/>, {wrapper: BrowserRouter});
    });

    test('renders SignIn component', () => {
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /sign in/i})).toBeInTheDocument();
    });

    test('allows the user to enter email and password', () => {
        fireEvent.change(screen.getByLabelText(/email/i), {target: {value: 'test@example.com'}});
        fireEvent.change(screen.getByLabelText(/password/i), {target: {value: 'password123'}});
        expect(screen.getByLabelText(/email/i).value).toBe('test@example.com');
        expect(screen.getByLabelText(/password/i).value).toBe('password123');
    });

    test('handles submit button click', () => {
        fireEvent.click(screen.getByRole('button', {name: /sign in/i}));
    });

});
