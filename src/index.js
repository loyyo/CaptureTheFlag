import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
