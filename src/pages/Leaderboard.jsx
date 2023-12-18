import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	LinearProgress,
	Paper,
	useMediaQuery,
} from '@mui/material';

import Table from '../components/Table.jsx';
import YourRank from '../components/YourRank.jsx';

export default function Leaderboard() {
	const { getAllUsersData, allUsersData, currentUserData, getProfile } = useAuth();
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

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
			<Paper elevation={3} sx={{ mt: 5, mb: isMobile ? 5 : 1, p: 2 }}>
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' align='center'>
							Your Ranking
						</Typography>
						<YourRank currentUserData={currentUserData} allUsersData={allUsersData} />
					</Grid>
					<Box mt={2} mb={2} />
					<Grid item xs={12}>
						<Typography variant='h4' align='center' marginBottom={2}>
							Leaderboard
						</Typography>
						<Table allUsersData={allUsersData} />
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
}
