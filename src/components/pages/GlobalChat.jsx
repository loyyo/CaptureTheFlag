import { useEffect, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext.jsx';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Paper,
	Button,
	TextField,
	LinearProgress,
} from '@mui/material';
import ChatMessage from '../ChatMessage.jsx';

const PREFIX = 'GlobalChat';
const classes = {
	input: `${PREFIX}-input`,
};
const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.input}`]: {
		'&::placeholder': {
			color: 'white',
			textAlign: 'center',
		},
		color: 'white',
		background: theme.palette.primary.light,
	},
}));

export default function GlobalChat() {
	const messageRef = useRef();
	const dummy = useRef();
	const theme = useTheme();
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
				<Box sx={{ width: '100%' }}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<StyledContainer maxWidth='lg'>
			<CssBaseline />
			<Box mt={5} mb={5}>
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' className='header-text'>
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
						<Box sx={{ background: theme.palette.primary.main }}>
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
											className={classes.input}
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
											sx={{ background: theme.palette.primary.light }}
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
						<Typography variant='h5' className='header-text-dark'>
							Chat will be available after capturing your first flag (｡◕‿◕｡)
						</Typography>
					)}
				</Grid>
			</Box>
		</StyledContainer>
	);
}
