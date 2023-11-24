import { useState, useEffect } from 'react';
import { Link, Box, Typography, Container, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Person as PersonIcon, Flag as FlagIcon, Equalizer as EqualizerIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Footer = () => {
	const [selectedLocation, setSelectedLocation] = useState('');
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { currentUser } = useAuth();

	const navigationItems = [
		{ label: 'Challenges', icon: FlagIcon, path: '/challenges' },
		{ label: 'Leaderboard', icon: EqualizerIcon, path: '/leaderboard' },
		{ label: 'Profile', icon: PersonIcon, path: '/profile' },
	];

	useEffect(() => {
		// Set the selected location based on the current pathname
		const currentNavItem = navigationItems.find(item => item.path === pathname);
		setSelectedLocation(currentNavItem ? currentNavItem.path : '');
	}, [pathname]);

	const handleNavigationChange = (path) => {
		navigate(path);
	};

	//TODO: zrobić może żeby to było zawsze przyklejone do dołu jak jest mobile
	//TODO: trzeba pomyśleć co zrobić w takim wypadku z headerem i menu (logout, darkmode itp, bo jak mamy już bottom navigation to po co nam na górze jeszcze)
	//TODO: jakoś to ze sobą pogodzić żeby to miało ręce i nogi

	if (!currentUser) {
		return (
			<Box mt={3} textAlign="center">
				<Typography variant="body2" color="textSecondary">
					{'Copyright © '}
					<Link color="inherit" href="https://github.com/loyyo/CaptureTheWDIctory">
						Capture The WDIctory
					</Link>{' '}
					{new Date().getFullYear()}
					{'.'}
				</Typography>
			</Box>
		);
	}

	return (
		<Container maxWidth="lg">
			<Box sx={{ width: '100%' }}>
				<Box mt={3}>
					<BottomNavigation value={selectedLocation} showLabels>
						{navigationItems.map(({ label, icon: Icon, path }) => (
							<BottomNavigationAction
								key={label}
								label={label}
								icon={<Icon stroke="#c6c6c6" strokeWidth={1} />}
								value={path}
								onClick={() => handleNavigationChange(path)}
							/>
						))}
					</BottomNavigation>
				</Box>
				<Box mt={3}>
					<Typography variant='body2' color='textSecondary' align='center'>
						{'Copyright © '}
						<Link color='inherit' href='https://github.com/loyyo/CaptureTheWDIctory'>
							Capture The WDIctory
						</Link>{' '}
						{new Date().getFullYear()}
						{'.'}
					</Typography>
				</Box>
			</Box>
		</Container>
	);
};

export default Footer;
