import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { CssBaseline, Container, Grid, Box, Typography, LinearProgress } from '@mui/material';

import Table from '../components/Table.jsx';
import YourRank from '../components/YourRank.jsx';

export default function Leaderboard() {
	const { getAllUsersData, allUsersData, currentUserData, getProfile } = useAuth();

	useEffect(() => {
		if (allUsersData.length === 0) {
			getAllUsersData();
		}
		if (!currentUserData) {
			getProfile();
		}
	});

	if (!currentUserData || allUsersData.length === 0) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box sx={{ width: '100%' }}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<Box mt={5} mb={5}>
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' className='header-text'>
							Your Ranking
						</Typography>
						<YourRank currentUserData={currentUserData} allUsersData={allUsersData} />
					</Grid>
					<Box mt={1} mb={1} />
					<Grid item xs={12}>
						<Typography variant='h4' className='header-text'>
							Leaderboard
						</Typography>
						<Table allUsersData={allUsersData} />
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}