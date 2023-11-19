import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AllChallenges from './components/pages/AllChallenges.jsx';
import Home from './components/pages/Home.jsx';
import Login from './components/pages/Login.jsx';
import Register from './components/pages/Register.jsx';
import Profile from './components/pages/Profile.jsx';
import Leaderboard from './components/pages/Leaderboard.jsx';
import EditProfile from './components/pages/EditProfile.jsx';
import ErrorPage from './components/pages/ErrorPage.jsx';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import PrivateRoute from './contexts/PrivateRoute.jsx';
import PrivateSubRoutes from './contexts/PrivateSubRoutes.jsx';
import LoggedInRoute from './contexts/LoggedInRoute.jsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Challenge from './components/pages/Challenge.jsx';
import UserProfile from './components/pages/UserProfile.jsx';
import GlobalChat from './components/pages/GlobalChat.jsx';

function App() {
	const theme = createTheme({
		palette: {
			type: 'light',
			primary: {
				light: '#7986cb',
				main: '#3f51b5',
				dark: '#303f9f',
			},
		},
	});

	const location = useLocation();
	const [leaderboard, setLeaderboard] = useState(false);
	useEffect(() => {
		if (location.pathname === '/leaderboard') {
			setLeaderboard(true);
		} else {
			setLeaderboard(false);
		}
	}, [location.pathname]);

	return (
		<div className={leaderboard ? 'App-leaderboard' : 'App'}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Header />
				<Routes>
					{/* Home */}
					<Route
						exact
						path='/'
						element={
							<LoggedInRoute>
								<Home />
							</LoggedInRoute>
						}
					/>
					{/* User related pages */}
					<Route
						exact
						path='/challenges'
						element={
							<PrivateRoute>
								<AllChallenges />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/profile'
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/leaderboard'
						element={
							<PrivateRoute>
								<Leaderboard />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/profile/settings'
						element={
							<PrivateRoute>
								<EditProfile />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/chat'
						element={
							<PrivateRoute>
								<GlobalChat />
							</PrivateRoute>
						}
					/>
					{/* Authentication */}
					<Route
						exact
						path='/login'
						element={
							<LoggedInRoute>
								<Login />
							</LoggedInRoute>
						}
					/>
					<Route
						exact
						path='/register'
						element={
							<LoggedInRoute>
								<Register />
							</LoggedInRoute>
						}
					/>
					{/* Challenges */}
					<Route exact path='/challenges' element={<PrivateSubRoutes />}>
						<Route path=':challengeID' element={<Challenge />} />
					</Route>
					{/* Users */}
					<Route exact path='/profiles' element={<PrivateSubRoutes />}>
						<Route path=':userID' element={<UserProfile />} />
					</Route>
					{/* Error - 404 page */}
					<Route path='*' element={<ErrorPage />} />
				</Routes>
				<Footer />
			</ThemeProvider>
		</div>
	);
}

export default App;
