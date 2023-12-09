import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CssBaseline, Container, Box, LinearProgress } from '@mui/material';
import ChallengePage from '../components/ChallengePage.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

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
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box sx={{ width: '100%' }}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	} else {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box mt={5} mb={5}>
					<ChallengePage challenge={singleChallengeData[0]} currentUser={currentUserData} />
				</Box>
			</Container>
		);
	}
}
