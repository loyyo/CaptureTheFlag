import {useEffect, useRef, useState} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import {useAuth} from '../contexts/AuthContext.jsx';
import {
    CssBaseline,
    Container,
    Grid,
    Box,
    Typography,
    Paper,
    Button,
    TextField,
    LinearProgress
} from '@mui/material';
import ChatMessage from '../components/ChatMessage.jsx';
import {Send as SendIcon} from '@mui/icons-material';

const PREFIX = 'GlobalChat';
const classes = {
    input: `${PREFIX}-input`,
};
const StyledContainer = styled(Container)(({theme}) => ({
    [`& .${classes.input}`]: {
        '&::placeholder': {
            textAlign: 'center',
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
            dummy.current.scrollIntoView({behavior: 'smooth'});
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
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 'calc(100vh - 90px)' // Header height
                }}>
                    <Box m={10}>
                        <LinearProgress/>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <StyledContainer maxWidth='lg' sx={{height: 'calc(100vh - 90px)'}}>
            <CssBaseline/>
            <Paper elevation={3} sx={{padding: theme.spacing(3, 3, 0), width: '100%', mt: 3, mb: 3}}>
                <Box mb={5}>
                    <Grid container direction='column'>
                        <Grid item xs={12} sx={{marginBottom: '20px'}}>
                            <Typography variant='h4' align="center">
                                Global Chat
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper square elevation={3}>
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
                        {currentUserData.points > 0 && (
                            <Box>
                                <Grid item container xs={12}>
                                    <Grid item xs={12} sm={10}>
                                        <Box p={2}>
                                            <TextField
                                                error={error}
                                                helperText={error ? 'Użyj mniej niż 1000 znaków!' : ''}
                                                inputRef={messageRef}
                                                placeholder='Type your message here'
                                                variant='outlined'
                                                fullWidth
                                                className={classes.input}
                                                InputProps={{classes: {input: classes.input}}}
                                                onKeyUp={kliknietyEnter}
                                            />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Box p={1} m={2}>
                                            <Button
                                                type='button'
                                                fullWidth
                                                variant='contained'
                                                size='large'
                                                disabled={loading}
                                                sx={{color: 'white'}}
                                                onClick={submitMessage}
                                            >
                                                Send
                                                <SendIcon sx={{ml: 1}}/> {/* Icon added next to the text */}
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
            </Paper>
        </StyledContainer>
    );
}
