import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserComponent from '../UserComponent.jsx';
import { LinearProgress, Box, Container, CssBaseline } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function UserProfile() {
	const { userID } = useParams();

	const { getUserProfile, thisUserData, allChallengesData, getAllChallengesData } = useAuth();

	useEffect(() => {
		if (allChallengesData.length === 0) {
			getAllChallengesData();
		}
		if (!thisUserData || thisUserData.userID !== userID) {
			getUserProfile(userID);
		}
	});

	if (!thisUserData || allChallengesData.length === 0 || thisUserData.userID !== userID) {
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
				<UserComponent currentUserData={thisUserData} allChallengesData={allChallengesData} />
			</Box>
		</Container>
	);
}
