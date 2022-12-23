import React, { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';

import Table from '../Table';
import YourRank from '../YourRank';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},
	loading: {
		width: '100%',
	},
}));

export default function Leaderboard() {
	const classes = useStyles();

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
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</Container>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' className='leaderboard-header'>
							Your Ranking
						</Typography>
						<YourRank currentUserData={currentUserData} allUsersData={allUsersData} />
					</Grid>
					<Box mt={1} mb={1} />
					<Grid item xs={12}>
						<Typography variant='h4' className='leaderboard-header'>
							Leaderboard
						</Typography>
						<Table allUsersData={allUsersData} />
					</Grid>
				</Grid>
			</div>
		</Container>
	);
}
