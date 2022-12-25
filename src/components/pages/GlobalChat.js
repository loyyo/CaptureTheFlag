import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@mui/material/TextField';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import ChatMessage from '../ChatMessage';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},
	loading: {
		width: '100%',
	},
	info: {
		background: theme.palette.primary.main,
	},
	button: {
		background: theme.palette.primary.light,
	},
	input: {
		'&::placeholder': {
			color: 'white',
			textAlign: 'center',
		},
		color: 'white',
		background: theme.palette.primary.light,
	},
}));

export default function GlobalChat() {
	const classes = useStyles();
	const messageRef = useRef();
	const dummy = useRef();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const {
		getAllUsersData,
		allUsersData,
		currentUserData,
		getProfile,
		globalMessages,
		sendMessage,
	} = useAuth();

	async function submitMessage() {
		if (messageRef.current.value !== '' && !loading && messageRef.current.value.length < 1000) {
			try {
				setLoading(true);
				await sendMessage(messageRef.current.value, currentUserData.userID);
				messageRef.current.value = '';
			} catch {
				console.error('Something went wrong :(');
			}
			setTimeout(() => {
				setLoading(false);
			}, 5000);
		} else if (messageRef.current.value.length >= 1000) {
			setError(true);
		}
	}

	const kliknietyEnter = (e) => {
		if (e.key === 'Enter') {
			submitMessage();
		}
	};

	useEffect(() => {
		if (allUsersData.length === 0) {
			getAllUsersData();
		}
		if (!currentUserData) {
			getProfile();
		}
	});

	useEffect(() => {
		if (currentUserData && allUsersData.length > 0) {
			dummy.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [globalMessages, currentUserData, allUsersData]);

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				setError(!error);
			}, 5000);
		}
	}, [error]);

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
							Global Chat
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Paper square elevation={0}>
							<Box p={1} className='messagesBox'>
								{globalMessages &&
									globalMessages.map((msg) => {
										return (
											<ChatMessage
												key={msg.createdAt.seconds}
												message={msg}
												currentUserData={currentUserData}
												allUsersData={allUsersData}
											/>
										);
									})}
								<div ref={dummy}></div>
							</Box>
						</Paper>
					</Grid>
					{currentUserData.points > 0 && (
						<Box className={classes.info}>
							<Grid item container xs={12}>
								<Grid item xs={12} sm={6}>
									<Box p={2}>
										<TextField
											error={error}
											helperText={error ? 'Użyj mniej niż 1000 znaków!' : ''}
											inputRef={messageRef}
											placeholder='Type your message here'
											variant='outlined'
											fullWidth
											InputProps={{ classes: { input: classes.input } }}
											onKeyPress={kliknietyEnter}
										/>
									</Box>
								</Grid>
								<Grid item xs={12} sm={6}>
									<Box p={1} m={2}>
										<Button
											type='button'
											fullWidth
											variant='contained'
											color='primary'
											size='large'
											disabled={loading}
											className={classes.button}
											onClick={submitMessage}
										>
											Send Message
										</Button>
									</Box>
								</Grid>
							</Grid>
						</Box>
					)}
					{currentUserData.points === 0 && (
						<Typography variant='h5' className='leaderboard-header-dark'>
							Chat will be available after capturing your first flag (｡◕‿◕｡)
						</Typography>
					)}
				</Grid>
			</div>
		</Container>
	);
}
