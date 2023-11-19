import { useState } from 'react';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'Header';

const classes = {
	root: `${PREFIX}-root`,
	colorInherit: `${PREFIX}-colorInherit`,
	menuButton: `${PREFIX}-menuButton`,
	title: `${PREFIX}-title`,
	icon: `${PREFIX}-icon`,
	href: `${PREFIX}-href`,
};

const StyledBox = styled(Box)(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
	},

	[`& .${classes.colorInherit}`]: {
		color: '#000000',
		backgroundColor: '#000000',
	},

	[`& .${classes.menuButton}`]: {
		marginLeft: theme.spacing(-0.5),
		marginRight: theme.spacing(0.5),
	},

	[`& .${classes.title}`]: {
		flexGrow: 1,
	},

	[`& .${classes.icon}`]: {
		color: 'white',
	},

	[`& .${classes.href}`]: {
		color: 'white',
		textDecoration: 'none',
		'&:hover': {
			color: 'white',
			textDecoration: 'none',
		},
	},
}));

const Header = () => {
	const navigate = useNavigate();

	const [anchorEl, setAnchorEl] = useState(null);
	const [error, setError] = useState('error');
	const open = Boolean(anchorEl);

	const { currentUser, logout } = useAuth();

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

	return (
		<StyledBox className={classes.root}>
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
							]}
						</Menu>
					</div>
				</Toolbar>
			</AppBar>
		</StyledBox>
	);
};

export default Header;
