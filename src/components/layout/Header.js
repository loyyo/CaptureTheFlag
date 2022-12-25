import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconButton from '@material-ui/core/IconButton';
import { useAuth } from '../../contexts/AuthContext';
import FlagIcon from '@material-ui/icons/Flag';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	colorInherit: {
		color: '#000000',
		backgroundColor: '#000000',
	},
	menuButton: {
		marginLeft: theme.spacing(-0.5),
		marginRight: theme.spacing(0.5),
	},
	title: {
		flexGrow: 1,
	},
	icon: {
		color: 'white',
	},
	href: {
		color: 'white',
		textDecoration: 'none',
		'&:hover': {
			color: 'white',
			textDecoration: 'none',
		},
	},
}));

const Header = () => {
	const classes = useStyles();
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState(null);
	const [error, setError] = useState('error');
	const open = Boolean(anchorEl);

	const { switchDarkMode, currentUser, logout } = useAuth();

	async function handleLogout() {
		setError('');
		try {
			await logout();
			navigate(0);
		} catch {
			setError('Failed to log out');
			console.error(error);
		}
	}

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
		<>
			<div className={classes.root}>
				<AppBar color='primary' position='static'>
					<Toolbar>
						<div className={classes.title}>
							<Button
								onClick={() => {
									navigate('/');
								}}
							>
								<Typography className={classes.href} variant='subtitle2'>
									Capture The Flag
								</Typography>
							</Button>
						</div>

						{currentUser !== null && (
							<>
								<Button
									onClick={() => {
										navigate('/challenges');
									}}
								>
									<FlagIcon className={classes.icon} />
								</Button>
								<Button
									onClick={() => {
										navigate('/leaderboard');
									}}
									className={classes.menuButton}
								>
									<EqualizerIcon className={classes.icon} />
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
								<AccountCircle className={classes.icon} />
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
										{/* {darkMode === 'true' ? 'Light Mode' : 'Dark Mode'} */}
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
										{/* {darkMode === 'true' ? 'Light Mode' : 'Dark Mode'} */}
									</MenuItem>,
								]}
							</Menu>
						</div>
					</Toolbar>
				</AppBar>
			</div>
		</>
	);
};

export default Header;
