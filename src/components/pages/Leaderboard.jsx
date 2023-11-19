import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { CssBaseline, Container, Grid, Box, Typography, LinearProgress } from '@mui/material';

import Table from '../Table.jsx';
import YourRank from '../YourRank.jsx';

const PREFIX = 'Leaderboard';

const classes = {
	paper: `${PREFIX}-paper`,
	loading: `${PREFIX}-loading`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},

	[`& .${classes.loading}`]: {
		width: '100%',
	},
}));

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
			<StyledContainer component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</StyledContainer>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
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
			</div>
		</Container>
	);
}
