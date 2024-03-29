import { useState, useEffect } from 'react';
import { useTheme, useMediaQuery } from '@mui/material'; // Corrected import
import {
	Typography,
	Button,
	IconButton,
	AppBar,
	Toolbar,
	MenuItem,
	Grid,
	Menu,
	Box,
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	const [anchorEl, setAnchorEl] = useState(null);
	const { darkMode, switchDarkMode, currentUser, logout } = useAuth();
	const location = useLocation(); // Get the current location
	const [currentPage, setCurrentPage] = useState('');

	const isMenuOpen = Boolean(anchorEl);

	const handleLogout = async () => {
		try {
			await logout();
		} catch (error) {
			console.error('Failed to log out:', error);
		}
	};

	const navigateTo = (path) => {
		handleCloseMenu();
		navigate(path);
	};

	const activeButtonStyle = {
		color: theme.palette.primary.dark,
		backgroundColor: 'white',
		borderTopLeftRadius: theme.shape.borderRadius,
		borderTopRightRadius: theme.shape.borderRadius,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		borderBottom: '2px solid #252028',
		'&:hover': {
			backgroundColor: 'white',
		},
	};

	const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
	const handleCloseMenu = () => setAnchorEl(null);

	useEffect(() => {
		setCurrentPage(location.pathname);
	}, [location]);

	const renderMenuItems = () => {
		const items =
			currentUser === null
				? [
						<MenuItem key='login' onClick={() => navigateTo('/login')}>
							Login
						</MenuItem>,
						<MenuItem key='register' onClick={() => navigateTo('/register')}>
							Sign Up
						</MenuItem>,
				  ]
				: [
						<MenuItem key='profile' onClick={() => navigateTo('/profile')}>
							Profile
						</MenuItem>,
						<MenuItem key='settings' onClick={() => navigateTo('/profile/settings')}>
							Settings
						</MenuItem>,
						<MenuItem key='logout' onClick={handleLogout}>
							Logout
						</MenuItem>,
				  ];

		items.push(
			<MenuItem key='mode' onClick={switchDarkMode}>
				{darkMode === 'true' ? 'Light Mode' : 'Dark Mode'}
			</MenuItem>
		);

		return items;
	};
	const isActive = (path) => currentPage === path;

	return (
		<Box sx={{ flexGrow: 1, minHeight: '7.661vh' }}>
			<Box
				sx={{
					boxShadow: 'none',
					backgroundColor: 'transparent',
					color: 'inherit',
				}}
			>
				<Toolbar>
					{/* Brainplex Logo/Button */}
					<Grid container display={'flex'} justifyContent={'space-between'}>
						<Grid item order={1}>
							<Button onClick={() => navigateTo('/challenges')}>
								<Grid container alignItems={'center'} direction={'row'}>
									<img src='../../favicon.ico' alt='brainplex-logo' width={'35%'} />
									<Typography
										variant='subtitle2'
										color={'white'}
										fontSize={'1.25rem'}
										sx={{
											'&:hover': { textDecoration: 'none' },
											maxWidth: '1.25rem',
										}}
									>
										Brainplex
									</Typography>
								</Grid>
							</Button>
						</Grid>

						<Grid item ml={-11} order={2}>
							{/* Center Links for Desktop View */}
							{!isMobile && currentUser && (
								<Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
									<Button
										onClick={() => navigateTo('/challenges')}
										sx={{
											...(isActive('/challenges') ? activeButtonStyle : { color: 'white' }),
											mx: 2,
											fontSize: '1.15rem',
										}}
									>
										Challenges
									</Button>
									<Button
										onClick={() => navigateTo('/challenge/add')}
										sx={{
											...(isActive('/challenge/add') ? activeButtonStyle : { color: 'white' }),
											mx: 2,
											fontSize: '1.15rem',
										}}
									>
										Create
									</Button>
									<Button
										onClick={() => navigateTo('/leaderboard')}
										sx={{
											...(isActive('/leaderboard') ? activeButtonStyle : { color: 'white' }),
											mx: 2,
											fontSize: '1.15rem',
										}}
									>
										Leaderboard
									</Button>
									<Button
										onClick={() => navigateTo('/chat')}
										sx={{
											...(isActive('/chat') ? activeButtonStyle : { color: 'white' }),
											mx: 2,
											fontSize: '1.15rem',
										}}
									>
										Chat
									</Button>
								</Box>
							)}
						</Grid>

						<Grid item order={3}>
							{/* Profile Icon/Button, always on the right */}
							<Box sx={{ marginLeft: 'auto' }}>
								<IconButton
									aria-label='account of current user'
									aria-controls='menu-appbar'
									aria-haspopup='true'
									onClick={handleOpenMenu}
									color='inherit'
								>
									<AccountCircle sx={{ color: 'white', fontSize: '2rem' }} />
								</IconButton>
							</Box>

							<Menu
								id='menu-appbar'
								anchorEl={anchorEl}
								anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
								keepMounted
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								open={isMenuOpen}
								onClose={handleCloseMenu}
							>
								{renderMenuItems()}
							</Menu>
						</Grid>
					</Grid>
				</Toolbar>
			</Box>
		</Box>
	);
};

export default Header;
