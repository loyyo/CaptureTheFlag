import { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import UserComponent from '../UserComponent.jsx';
import { LinearProgress, Box, Container, CssBaseline } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PREFIX = 'UserProfile';

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
				<UserComponent currentUserData={thisUserData} allChallengesData={allChallengesData} />
			</div>
		</Container>
	);
}
