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
	const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
			<Paper elevation={0} sx={{ mt: isMobile ? 1 : 2, mb: isMobile ? 8 : 2, p: isMobile ? 1 : 3 }}>
				<Grid container direction='column'>
					<Grid item xs={12} mt={isMobile ? 2 : 0}>
						<Typography variant='h4' align='center'>
							Your Ranking
						</Typography>
						<YourRank currentUserData={currentUserData} allUsersData={allUsersData} />
					</Grid>
					<Grid item xs={12}>
						<Typography variant='h4' align='center' marginBottom={1}>
							Leaderboard
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Table allUsersData={allUsersData} />
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
}
