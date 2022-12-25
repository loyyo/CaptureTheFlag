import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Typography from '@material-ui/core/Typography';
import FlagIcon from '@material-ui/icons/Flag';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import PersonIcon from '@material-ui/icons/Person';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const useStyles = makeStyles({
	root: {
		width: '100%',
	},
});

const Footer = () => {
	const classes = useStyles();
	const [value, setValue] = useState(null);
	const navigate = useNavigate();
	const location = useLocation();

	const { currentUser } = useAuth();

	// async function addChallenge() {
	// 	try {
	// 		await addChallenges();
	// 		navigate(0);
	// 		console.log('Udalo sie dodac wyzwanie');
	// 	} catch {
	// 		console.error('Nie udalo sie dodac zadania');
	// 	}
	// }

	useEffect(() => {
		if (location.pathname !== '/challenges') {
			if (location.pathname !== '/leaderboard') {
				if (location.pathname !== '/profile') {
					setValue(null);
				}
			}
		}
	}, [location.pathname]);

	if (!currentUser) {
		return (
			<Box mt={3}>
				<Typography variant='body2' color='textSecondary' align='center'>
					{'Copyright © '}
					<Link color='inherit' href='https://github.com/loyyo/CaptureTheFlag'>
						Capture The Flag
					</Link>{' '}
					{new Date().getFullYear()}
					{'.'}
				</Typography>
			</Box>
		);
	}

	return (
		<Container maxWidth='lg'>
			<div className={classes.root}>
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
							icon={<FlagIcon stroke='#c6c6c6' strokeWidth={1} />}
							className='bottomIcon'
						/>
						<BottomNavigationAction
							onClick={() => {
								navigate('/leaderboard');
							}}
							label='Leaderboard'
							icon={<EqualizerIcon stroke='#c6c6c6' strokeWidth={1} />}
							className='bottomIcon'
						/>
						<BottomNavigationAction
							onClick={() => {
								navigate('/profile');
							}}
							label='Profile'
							icon={<PersonIcon stroke='#c6c6c6' strokeWidth={1} />}
							className='bottomIcon'
						/>
					</BottomNavigation>
				</Box>
				<Box mt={3}>
					<Typography variant='body2' color='textSecondary' align='center'>
						{'Copyright © '}
						<Link color='inherit' href='https://github.com/loyyo/CaptureTheFlag'>
							Capture The Flag
						</Link>{' '}
						{new Date().getFullYear()}
						{'.'}
					</Typography>
				</Box>
			</div>
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
