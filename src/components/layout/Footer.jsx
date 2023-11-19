import { useState, useEffect } from 'react';
import {
	Link,
	Box,
	Typography,
	Container,
	CssBaseline,
	BottomNavigation,
	BottomNavigationAction,
} from '@mui/material';
import {
	Person as PersonIcon,
	Flag as FlagIcon,
	Equalizer as EqualizerIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const Footer = () => {
	const [value, setValue] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();

	const { currentUser } = useAuth();

	useEffect(() => {
		if (location.pathname !== '/challenges') {
			if (location.pathname !== '/leaderboard') {
				if (location.pathname !== '/profile') {
					setValue(null);
				}
			}
		}
	}, [location.pathname]);

	// return (
	// 	<Box mt={3}>
	// 		<Typography variant='body2' color='textSecondary' align='center'>
	// 			{'Copyright © '}
	// 			<Link underline='hover' color='inherit' href='https://github.com/loyyo/CaptureTheFlag'>
	// 				Capture The Flag
	// 			</Link>{' '}
	// 			{new Date().getFullYear()}
	// 			{'.'}
	// 		</Typography>
	// 	</Box>
	// );

	//TODO: zrobić może żeby to było zawsze przyklejone do dołu jak jest mobile
	//TODO: trzeba pomyśleć co zrobić w takim wypadku z headerem i menu (logout, darkmode itp, bo jak mamy już bottom navigation to po co nam na górze jeszcze)
	//TODO: jakoś to ze sobą pogodzić żeby to miało ręce i nogi

	if (!currentUser) {
		return (
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
		);
	}

	return (
		<Container maxWidth='lg'>
			<Box sx={{ width: '100%' }}>
				<CssBaseline />
				<Box mt={3}>
					<BottomNavigation
						value={value}
						onChange={(event, newValue) => {
							setValue(newValue);
						}}
						showLabels
					>
						<BottomNavigationAction
							onClick={() => {
								navigate('/challenges');
							}}
							label='Challenges'
							icon={<FlagIcon stroke='#c6c6c6' stroke-width={1} />}
							className='bottomIcon'
						/>
						<BottomNavigationAction
							onClick={() => {
								navigate('/leaderboard');
							}}
							label='Leaderboard'
							icon={<EqualizerIcon stroke='#c6c6c6' stroke-width={1} />}
							className='bottomIcon'
						/>
						<BottomNavigationAction
							onClick={() => {
								navigate('/profile');
							}}
							label='Profile'
							icon={<PersonIcon stroke='#c6c6c6' stroke-width={1} />}
							className='bottomIcon'
						/>
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
			{/* <button
				onClick={addChallenge}
				// onClick={() => {
				// 	var xd = 'al-Hariz';
				// 	console.log(xd.toLowerCase());
				// }}
			>
				ADDCHALENGE
			</button> */}
		</Container>
	);
};

export default Footer;
