import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import { CssBaseline, Container, Box, LinearProgress } from '@mui/material';
import ChallengePage from '../ChallengePage.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PREFIX = 'Challenge';

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

export default function Challenge() {
	const { challengeID } = useParams();

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
			<StyledContainer component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</StyledContainer>
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
