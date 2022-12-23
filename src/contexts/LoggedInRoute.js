import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const LoggedInRoute = ({ children }) => {
	const { currentUser } = useAuth();

	return !currentUser ? children : <Navigate to='/profile' />;
};

export default LoggedInRoute;
