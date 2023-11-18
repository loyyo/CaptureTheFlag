import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CssBaseline, Container, Box, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ChallengePage from '../ChallengePage.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},
	loading: {
		width: '100%',
	},
}));

export default function Challenge() {
	const { challengeID } = useParams();
	const classes = useStyles();
	const { getSingleChallengeData, singleChallengeData, getProfile, currentUserData } = useAuth();

	useEffect(() => {
		setTimeout(() => {
			if (!currentUserData) {
				getProfile();
			}
			if (singleChallengeData.length === 0 || singleChallengeData[0].url !== challengeID) {
				getSingleChallengeData(challengeID);
			}
		}, 100);
	});

	if (
		singleChallengeData.length === 0 ||
		!currentUserData ||
		singleChallengeData[0].url !== challengeID
	) {
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
	} else {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.paper}>
					<ChallengePage challenge={singleChallengeData} currentUser={currentUserData} />
				</div>
			</Container>
		);
	}
}
