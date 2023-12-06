import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Typography, Button, IconButton, AppBar, Toolbar, MenuItem, Menu, Box } from '@mui/material';
import {AccountCircle, Flag as FlagIcon, Equalizer as EqualizerIcon, Add as AddIcon} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();
	const theme = useTheme();
	const [anchorEl, setAnchorEl] = useState(null);
	const { darkMode, switchDarkMode, currentUser, logout } = useAuth();

	const isMenuOpen = Boolean(anchorEl);

	const handleLogout = async () => {
		try {
			await logout();
			window.location.href = `/`;
		} catch (error) {
			console.error('Failed to log out:', error);
		}
	};

	const navigateTo = (path) => {
		handleCloseMenu();
		navigate(path);
	};

	const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
	const handleCloseMenu = () => setAnchorEl(null);

	const renderMenuItems = () => {
		if (currentUser === null) {
			return [
				<MenuItem key="login" onClick={() => navigateTo('/login')}>Login</MenuItem>,
				<MenuItem key="register" onClick={() => navigateTo('/register')}>Sign Up</MenuItem>
			];
		}
		return [
			<MenuItem key="profile" onClick={() => navigateTo('/profile')}>Profile</MenuItem>,
			<MenuItem key="settings" onClick={() => navigateTo('/profile/settings')}>Settings</MenuItem>,
			<MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>,
			<MenuItem key="chat" onClick={() => navigateTo('/chat')}>Chat</MenuItem>,
			<MenuItem key="mode" onClick={switchDarkMode}>{darkMode === 'true' ? 'Light Mode' : 'Dark Mode'}</MenuItem>
		];
	};


	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar color="primary" position="fixed">
				<Toolbar>
					<Box sx={{ flexGrow: 1 }}>
						<Button onClick={() => navigateTo('/challenges')}>
							<Typography variant="subtitle2" sx={{ color: 'white', '&:hover': { textDecoration: 'none' } }}>
								Capture The Flag
							</Typography>
						</Button>
					</Box>
					{currentUser && (
						<>
							<Button onClick={() => navigateTo('/challenge/add')} sx={{ marginRight: theme.spacing(-1 ) }}>
								<AddIcon sx={{ color: 'white' }} />
							</Button>
							<Button onClick={() => navigateTo('/challenges')}>
								<FlagIcon sx={{ color: 'white' }} />
							</Button>
							<Button onClick={() => navigateTo('/leaderboard')} sx={{
								marginLeft: theme.spacing(-0.5),
								marginRight: theme.spacing(0.5),
							}}>
								<EqualizerIcon sx={{ color: 'white' }} />
							</Button>
						</>
					)}
					<IconButton
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleOpenMenu}
						color="inherit"
					>
						<AccountCircle sx={{ color: 'white' }} />
					</IconButton>
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
						keepMounted
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						open={isMenuOpen}
						onClose={handleCloseMenu}
					>
						{renderMenuItems()}
					</Menu>
				</Toolbar>
			</AppBar>
			<Box sx={{ mt: '90px' }}></Box>
		</Box>

	);
};

export default Header;
