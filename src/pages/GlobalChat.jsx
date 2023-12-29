import { useEffect, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { useAuth } from '../contexts/AuthContext.jsx';
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
	useMediaQuery,
} from '@mui/material';
import ChatMessage from '../components/ChatMessage.jsx';
import { Send as SendIcon } from '@mui/icons-material';

const PREFIX = 'GlobalChat';
const classes = {
	input: `${PREFIX}-input`,
};
const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.input}`]: {
		'&::placeholder': {
			textAlign: 'left',
			opacity: 1,
		},
		color: '',
	},
}));

export default function GlobalChat() {
	const messageRef = useRef();
	const dummy = useRef();
	const theme = useTheme();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const {
		getAllUsersData,
		allUsersData,
		currentUserData,
		getProfile,
		globalMessages,
		sendMessage,
	} = useAuth();

	const submitMessage = async () => {
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
	};

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
				<Box
					sx={{
						mt: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						height: 'calc(100vh - 90px)', // Header height
					}}
				>
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
			<Paper
				elevation={0}
				sx={{ padding: theme.spacing(2, 2, 0), width: '100%', mt: isMobile ? 1 : 2, mb: 3 }}
			>
				<Box mb={8}>
					<Grid container direction='column'>
						<Grid item xs={12} mb={isMobile ? 0.5 : 2}>
							<Typography variant='h4' align='center'>
								Global Chat
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Paper square sx={{ border: '2px solid #252028' }}>
								<Box p={1} className='messagesBox'>
									{globalMessages?.map((msg) => (
										<ChatMessage
											key={msg.createdAt.seconds}
											message={msg}
											currentUserData={currentUserData}
											allUsersData={allUsersData}
										/>
									))}
									<div ref={dummy}></div>
								</Box>
							</Paper>
						</Grid>
						<Grid item container xs={12} sx={{ padding: 0, paddingBottom: 1, paddingTop: 1 }}>
							<Grid item xs={9} sm={10}>
								<Box pt={1} pb={1} pr={1} pl={isMobile ? 0.5 : 4}>
									<TextField
										error={error}
										helperText={error ? 'Użyj mniej niż 1000 znaków!' : ''}
										inputRef={messageRef}
										placeholder={isMobile ? 'Type here' : 'Type your message'}
										variant='outlined'
										fullWidth
										className={classes.input}
										InputProps={{ classes: { input: classes.input } }}
										onKeyUp={kliknietyEnter}
										size={isMobile ? 'small' : 'medium'}
									/>
								</Box>
							</Grid>
							<Grid item xs={3} sm={2}>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100%',
									}}
								>
									<Button
										type='button'
										fullWidth
										variant='contained'
										size='large'
										disabled={loading}
										onClick={submitMessage}
										sx={{
											maxWidth: 'fit-content',
											height: '65%',
											backgroundColor: '#40376F',
											color: 'white',
										}}
									>
										{isMobile ? (
											<SendIcon />
										) : (
											<>
												Send
												<SendIcon sx={{ ml: 1 }} />
											</>
										)}
									</Button>
								</Box>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</Paper>
		</StyledContainer>
	);
}
