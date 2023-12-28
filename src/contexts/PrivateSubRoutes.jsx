import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

const PrivateSubRoutes = () => {
	const { currentUser } = useAuth();
	return currentUser ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateSubRoutes;
