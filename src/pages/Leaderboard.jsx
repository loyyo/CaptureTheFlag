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
				<Box
					sx={{
						mt: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						height: 'calc(100vh - 90px)', // Header height
					}}
				>
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
			<Paper elevation={0} sx={{ mt: 2, mb: isMobile ? 5 : 1, p: isMobile ? '10px 0' : 3 }}>
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' align='center'>
							Your Ranking
						</Typography>
						<YourRank currentUserData={currentUserData} allUsersData={allUsersData} />
					</Grid>
					<Grid item xs={12}>
						<Typography variant='h4' align='center' marginBottom={1}>
							Leaderboard
						</Typography>
						<Table allUsersData={allUsersData} />
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
}
