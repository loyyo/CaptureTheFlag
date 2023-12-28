import { useState, useEffect, useMemo } from 'react';
import { Box, Container, BottomNavigation, BottomNavigationAction } from '@mui/material';
import {
	EmojiEvents as TrophyIcon,
	Equalizer as EqualizerIcon,
	Chat as ChatIcon,
	AddCircleOutline as AddIcon,
} from '@mui/icons-material'; // Import TrophyIcon
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useMediaQuery } from '@mui/material';

const Footer = () => {
	const [selectedLocation, setSelectedLocation] = useState('');
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { currentUser } = useAuth();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

	const navigationItems = useMemo(
		() => [
			{ label: 'Challenges', icon: TrophyIcon, path: '/challenges' }, // Updated to TrophyIcon
			{ label: 'Create', icon: AddIcon, path: '/challenge/add' },
			{ label: 'Leaderboard', icon: EqualizerIcon, path: '/leaderboard' },
			{ label: 'Chat', icon: ChatIcon, path: '/chat' },
		],
		[]
	);

	useEffect(() => {
		const currentNavItem = navigationItems.find((item) => item.path === pathname);
		setSelectedLocation(currentNavItem ? currentNavItem.path : '');
	}, [pathname, navigationItems]);

	const handleNavigationChange = (path) => {
		navigate(path);
	};

	if (!currentUser || !isMobile) {
		return null;
	}

	return (
		<Container maxWidth='lg' disableGutters>
			<Box sx={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000, padding: 0 }}>
				<Box mt={3}>
					<BottomNavigation value={selectedLocation} showLabels sx={{ width: '100%', padding: 0 }}>
						{navigationItems.map(({ label, icon: Icon, path }) => (
							<BottomNavigationAction
								key={label}
								label={label}
								icon={<Icon stroke='#c6c6c6' strokeWidth={1} />}
								value={path}
								onClick={() => handleNavigationChange(path)}
								sx={{ width: '25%', padding: 0 }}
							/>
						))}
					</BottomNavigation>
				</Box>
			</Box>
		</Container>
	);
};

export default Footer;
