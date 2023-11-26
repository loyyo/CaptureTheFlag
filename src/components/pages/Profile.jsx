import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	CssBaseline,
	Paper,
	Container,
	Divider,
	Grid,
	ImageList,
	Box,
	Avatar,
	Typography,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Checkbox,
	LinearProgress,
	Button,
	useMediaQuery,
} from '@mui/material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
} from 'chart.js';

export default function Profile() {
	const navigate = useNavigate();
	const { getProfile, currentUserData, allChallengesData, getAllChallengesData } = useAuth();
	const theme = useTheme();
	const lg = useMediaQuery(theme.breakpoints.up('md'));
	const md = useMediaQuery(theme.breakpoints.down('md'));
	const xs = useMediaQuery(theme.breakpoints.down('xs'));
	const [activeView, setActiveView] = useState('profile');
	useEffect(() => {
		if (!currentUserData) {
			getProfile();
		}
		if (allChallengesData.length === 0) {
			getAllChallengesData();
		}
	}, [currentUserData, allChallengesData, getProfile, getAllChallengesData]);

	const totalChallenges = allChallengesData.length;
	// const completedChallenges = currentUserData.challengesCompleted.length;
	const completedChallenges = 15;

	const doughnutData = {
		labels: ['Completed', 'Remaining'],
		datasets: [{
			data: [completedChallenges, totalChallenges - completedChallenges],
			backgroundColor: ['#003f5c', '#2f4b7c'],
			hoverBackgroundColor: ['#003f5c', '#2f4b7c']
		}]
	};

	const barData = {
		labels: ['Easy', 'Medium', 'Hard'],
		datasets: [{
			label: 'Challenges',
			data: [20, 15, 10],
			backgroundColor: ['#2f4b7c', '#665191', '#a05195'],
			borderColor: ['#747d8c', '#747d8c', '#747d8c'],
			borderWidth: 1
		}]
	};

	const barOptions = {
		indexAxis: 'y',
		scales: {
			x: {
				grid: {
					display: false
				}
			},
			y: {
				grid: {
					display: false
				}
			}
		},
		plugins: {
			legend: {
				display: false
			}
		}
	};

	const screenSize = () => {
		if (lg) {
			return 3;
		}
		if (md) {
			if (xs) {
				return 1;
			}
			return 3;
		}
	};

	if (!currentUserData || allChallengesData.length === 0) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
					<Typography variant='h4'>Loading...</Typography>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<Box mt={5} mb={5}>
				<Paper variant='elevation' elevation={7}>
					{/* Przyciski do przełączania widoków */}
					<Box display='flex' justifyContent='center' p={2}>
						<Button
							variant={activeView === 'profile' ? 'contained' : 'outlined'}
							color='primary'
							onClick={() => setActiveView('profile')}
							sx={{ mr: 1 }}
						>
							Your Profile
						</Button>
						<Button
							variant={activeView === 'challenges' ? 'contained' : 'outlined'}
							color='primary'
							onClick={() => setActiveView('challenges')}
						>
							Your Challenges
						</Button>
					</Box>

					<Grid container spacing={3}>
						{/* Avatar, opis i przycisk */}
						<Grid item xs={12} md={3}>
							<Box display='flex' flexDirection='column' alignItems='center' mb={2}>
								<Box display='flex' flexDirection='row' alignItems='center' sx={{ width: '100%', justifyContent: 'center' }}>
									<Avatar
										variant='rounded'
										alt='Profile Avatar'
										src={currentUserData.avatar}
										sx={{ width: '100px', height: '100px', mr: 2 }}
									/>
									<Box>
										<Typography variant='h6'>{currentUserData.username}</Typography>
										<Typography variant='body1'>Points: {currentUserData.points}</Typography>
										<Typography variant='body1'>Ranking: {currentUserData.ranking}</Typography>
									</Box>
								</Box>
								<Button
									variant='contained'
									color='primary'
									onClick={() => navigate('/profile/settings')}
									sx={{ mt: 2 }}
								>
									Edit Profile
								</Button>
							</Box>
						</Grid>

						{/* Warunkowe renderowanie zawartości */}
						{activeView === 'profile' ? (
							// Wyświetl wykresy
							<Grid item xs={12} md={9}>
								<Box display='flex' flexDirection='row' justifyContent='center' alignItems='center' height='100%'>
									<Box width='50%'>
										<Doughnut data={doughnutData} />
									</Box>
									<Box width='50%'>
										<Bar data={barData} options={barOptions} />
									</Box>
								</Box>
							</Grid>
						) : (
							// Wyświetl wykonane wyzwania
							<Grid item xs={12} md={9}>

								<Box mt={1}>
									<Typography align='center' display='block' variant='h5'>
										Completed Challenges:
									</Typography>
									<Box mt={1}>
										<Divider />
										<Divider />
										<ImageList
											rowHeight='auto'
											gap={0}
											cols={screenSize()}
											sx={{
												width: '100%',
												backgroundColor: theme.palette.background.paper,
												// display: 'flex',
												flexDirection: 'row',
												// padding: 0,
											}}
										>
											{allChallengesData.map((e, index) => {
												return (
													<ListItemButton
														sx={{ cursor: 'default' }}
														divider
														onClick={() => {
															navigate(`/challenges/${e.url}`);
														}}
														key={index}
													>
														<Divider orientation='vertical' />
														<ListItemIcon>
															<Checkbox
																sx={{ cursor: 'default' }}
																edge='end'
																checked={currentUserData.challenges[e.url]}
																disableRipple
																disabled
																color='primary'
															/>
														</ListItemIcon>
														<ListItemText id='challenge1' primary={e.title} />
														<Divider orientation='vertical' />
													</ListItemButton>
												);
											})}
										</ImageList>
									</Box>
								</Box>
							</Grid>
						)}
					</Grid>
				</Paper>
			</Box>
		</Container>
	);
}


ChartJS.register(
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
	Title
);