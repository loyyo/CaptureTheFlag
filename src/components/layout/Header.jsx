import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	Typography,
	Button,
	IconButton,
	AppBar,
	Toolbar,
	MenuItem,
	Menu,
	Box,
} from '@mui/material';
import { AccountCircle, Flag as FlagIcon, Equalizer as EqualizerIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const Header = () => {
	const navigate = useNavigate();
	const theme = useTheme();

	const [anchorEl, setAnchorEl] = useState(null);
	const [error, setError] = useState('error');
	const open = Boolean(anchorEl);

	const { darkMode, switchDarkMode, currentUser, logout } = useAuth();

	const handleLogout = async () => {
		setError('');
		try {
			await logout();
			navigate(0);
		} catch {
			setError('Failed to log out');
			console.error(error);
		}
	};

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDarkMode = () => {
		switchDarkMode();
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar color='primary' position='static'>
				<Toolbar>
					<Box sx={{ flexGrow: 1 }}>
						<Button
							onClick={() => {
								navigate('/');
							}}
						>
							<Typography
								sx={{
									color: 'white',
									textDecoration: 'none',
									'&:hover': {
										color: 'white',
										textDecoration: 'none',
									},
								}}
								variant='subtitle2'
							>
								Capture The Flag
							</Typography>
						</Button>
					</Box>

					{currentUser !== null && (
						<>
							<Button
								onClick={() => {
									navigate('/challenges');
								}}
							>
								<FlagIcon sx={{ color: 'white' }} />
							</Button>
							<Button
								onClick={() => {
									navigate('/leaderboard');
								}}
								sx={{
									marginLeft: theme.spacing(-0.5),
									marginRight: theme.spacing(0.5),
								}}
							>
								<EqualizerIcon sx={{ color: 'white' }} />
							</Button>
						</>
					)}

					<div className=''>
						<IconButton
							aria-label='account of current user'
							aria-controls='menu-appbar'
							aria-haspopup='true'
							onClick={handleMenu}
							color='inherit'
						>
							<AccountCircle sx={{ color: 'white' }} />
						</IconButton>
						<Menu
							id='menu-appbar'
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={open}
							onClose={handleClose}
						>
							{currentUser === null && [
								<MenuItem
									key='login'
									onClick={() => {
										handleClose();
										navigate('/login');
									}}
								>
									Login
								</MenuItem>,
								<MenuItem
									key='register'
									onClick={() => {
										handleClose();
										navigate('/register');
									}}
								>
									Sign Up
								</MenuItem>,
								<MenuItem key='darkMode' className='headerDarkMode' onClick={handleDarkMode}>
									{darkMode === 'true' ? 'Light Mode' : 'Dark Mode'}
								</MenuItem>,
							]}
							{currentUser !== null && [
								<MenuItem
									key='profile'
									onClick={() => {
										handleClose();
										navigate('/profile');
									}}
								>
									Profile
								</MenuItem>,
								<MenuItem
									key='settings'
									onClick={() => {
										handleClose();
										navigate('/profile/settings');
									}}
								>
									Settings
								</MenuItem>,
								<MenuItem
									key='home'
									onClick={() => {
										handleClose();
										handleLogout();
										navigate('/');
									}}
								>
									Logout
								</MenuItem>,
								<MenuItem
									key='chat'
									onClick={() => {
										handleClose();
										navigate('/chat');
									}}
								>
									Chat
								</MenuItem>,
								<MenuItem key='darkMode' className='headerDarkMode' onClick={handleDarkMode}>
									{darkMode === 'true' ? 'Light Mode' : 'Dark Mode'}
								</MenuItem>,
							]}
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</Box>
	);
};

export default Header;
