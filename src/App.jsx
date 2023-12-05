import './App.css';
import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AllChallenges from './pages/AllChallenges.jsx';
import AddChallenge from './pages/AddChallenge.jsx';
import EditChallenge from './pages/EditChallenge.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import EditProfile from './pages/EditProfile.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import Footer from './layout/Footer.jsx';
import Header from './layout/Header.jsx';
import PrivateRoute from './contexts/PrivateRoute.jsx';
import PrivateSubRoutes from './contexts/PrivateSubRoutes.jsx';
import LoggedInRoute from './contexts/LoggedInRoute.jsx';
import { CssBaseline, useMediaQuery, createTheme, ThemeProvider } from '@mui/material';
import Challenge from './pages/Challenge.jsx';
import UserProfile from './pages/UserProfile.jsx';
import GlobalChat from './pages/GlobalChat.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
	const { darkMode } = useAuth();
	const prefersDarkMode = useMediaQuery(
		darkMode === 'true' ? '(prefers-color-scheme: dark)' : '(prefers-color-scheme: light)'
	);
	const theme = createTheme({
		palette: {
			mode: prefersDarkMode ? 'dark' : 'light',
			primary: {
				light: prefersDarkMode ? '#3f4fa3' : '#7986cb',
				main: prefersDarkMode ? '#2c387e' : '#3f51b5',
				dark: prefersDarkMode ? '#212c6f' : '#303f9f',
			},
		},
		components: {
			MuiCssBaseline: {
				styleOverrides: {
					'.Mui-selected .MuiBottomNavigationAction-wrapper .MuiSvgIcon-root': {
						color: prefersDarkMode ? '#111111' : '#3f51b5',
					},
					'.Mui-selected .MuiBottomNavigationAction-wrapper .Mui-selected': {
						color: prefersDarkMode ? '#111111' : '#3f51b5',
					},
					'.header-text': {
						backgroundColor: prefersDarkMode ? '#2c387e' : '#3f51b5',
					},
					'.header-text-dark': {
						backgroundColor: prefersDarkMode ? '#212c6f' : '#303f9f',
					},
					'.header-text-gold': {
						backgroundColor: prefersDarkMode ? '#212c6f' : '#303f9f',
					},
					'.header-text-light': {
						backgroundColor: prefersDarkMode ? '#3f4fa3' : '#7986cb',
					},
					'.header-text-light-right': {
						backgroundColor: prefersDarkMode ? '#3f4fa3' : '#7986cb',
					},
					'.ratings': {
						backgroundColor: prefersDarkMode ? '#3f4fa3' : '#7986cb',
					},
					'.description': {
						backgroundColor: prefersDarkMode ? '#3f4fa3' : '#7986cb',
					},
				},
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
						path='/challenges/:challengeURL/edit'
						element={
							<PrivateRoute>
								<EditChallenge />
							</PrivateRoute>
						}
					/>
					<Route
						exact
						path='/challenge/add'
						element={
							<PrivateRoute>
								<AddChallenge />
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
					<Route
						exact
						path='/reset-password'
						element={
							<LoggedInRoute>
								<ForgotPassword />
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
