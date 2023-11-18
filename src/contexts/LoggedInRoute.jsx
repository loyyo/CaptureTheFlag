import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import PropTypes from 'prop-types';

const LoggedInRoute = ({ children }) => {
	const { currentUser } = useAuth();
	return !currentUser ? children : <Navigate to='/profile' />;
};

LoggedInRoute.propTypes = {
	children: PropTypes.node.isRequired,
};

export default LoggedInRoute;
