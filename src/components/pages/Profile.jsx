import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	CssBaseline,
	Paper,
	Container,
	Grid,
	Box,
	Avatar,
	Typography,
	Button
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
					<Grid container spacing={3}>
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