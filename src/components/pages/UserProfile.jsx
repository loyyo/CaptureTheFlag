import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import UserComponent from '../UserComponent.jsx';
import { LinearProgress, Box, Container, CssBaseline } from '@mui/material';
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

export default function UserProfile() {
	const { userID } = useParams();
	const classes = useStyles();
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
				<UserComponent currentUserData={thisUserData} allChallengesData={allChallengesData} />
			</div>
		</Container>
	);
}
