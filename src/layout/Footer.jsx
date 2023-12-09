import { useState, useEffect } from 'react';
import { Link, Box, Typography, Container, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Person as PersonIcon, Flag as FlagIcon, Equalizer as EqualizerIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useMediaQuery } from '@mui/material';

const Footer = () => {
	const [selectedLocation, setSelectedLocation] = useState('');
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { currentUser } = useAuth();
	const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));

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

	if (!currentUser || !isMobile) {
		return;
	}

	return (
		<Container maxWidth="lg">
			<Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}>
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
			</Box>
		</Container>
	);
};

export default Footer;
