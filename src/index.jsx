import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import '../node_modules/font-awesome/css/font-awesome.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Router>
		{/* <React.StrictMode> */}
		<AuthProvider>
			<App />
		</AuthProvider>
		{/* </React.StrictMode> */}
	</Router>
);
