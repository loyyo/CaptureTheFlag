import {useState, useRef, useEffect} from 'react';
import {createTheme, ThemeProvider, styled, useTheme} from '@mui/material/styles';
import {Grid, Box, Typography, Button, TextField, Paper, Divider, Dialog, IconButton} from '@mui/material';
import {useMediaQuery} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.jsx';
import {green} from '@mui/material/colors';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

const PREFIX = 'ChallengePage';
const classes = {
    input: `${PREFIX}-input`,
};
const StyledGrid = styled(Grid)(({theme}) => ({
    [`& .${classes.input}`]: {
        '&::placeholder': {
            color: 'white',
            textAlign: 'center',
        },
        color: 'white',
        background: theme.palette.primary.light,
    },
}));

const successTheme = createTheme({
    palette: {
        error: green,
    },
});

export default function ChallengePage({challenge, currentUser}) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const keyRef = useRef();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isAuthor = currentUser.userID === challenge.userID;

    const navigate = useNavigate();
    const {doChallenge, rateChallenge} = useAuth();
    const [openDialog, setOpenDialog] = useState(false);

    const handleImageClick = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const checkKey = async () => {
        if (loading) {
            return;
        } else if (
            keyRef.current.value.toLowerCase() !== challenge.key.toLowerCase()
        ) {
            setError(true);
        } else {
            try {
                setError(false);
                setLoading(true);
                await doChallenge(
                    challenge.url,
                    challenge.points,
                    currentUser.email,
                    currentUser.points
                );
                setSuccess(true);
                setTimeout(() => {
                    // navigate('/challenges');
                    navigate(0);
                }, 2000);
            } catch {
                setError(true);
                setSuccess(false);
            }
            setLoading(false);
        }
    };

    const kliknietyEnter = (e) => {
        if (e.key === 'Enter') {
            checkKey();
        }
    };

    const getInitialRating = (challenge) => {
        let e = challenge.ratings;
        let v = 0;
        let i = 0;
        for (let k in e) {
            if (Object.hasOwn(e, k)) {
                v = v + e[k];
                i = i + 1;
            }
        }
        return v / i;
    };

    const handleRating = async (value) => {
        try {
            await rateChallenge(value, challenge.url, currentUser.userID);
            navigate('/challenges');
            navigate(0);
        } catch {
            console.error('Something bad happened :(');
        }
    };

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                setError(!error);
            }, 5000);
        }
    }, [error]);

    return (
        <StyledGrid container direction='column'>
            <Grid item xs={12}>
                <Typography variant='h4' className='header-text-dark'>
                    {challenge.title}
                </Typography>
                <Divider/>
            </Grid>
            <Grid item xs={12}>
                <Box>
                    <Typography variant='h5' className="description">
                        {challenge.description}
                    </Typography>
                </Box>
            </Grid>
            <Grid container item xs={12} justifyContent="space-between" alignItems="center">
                <Grid item xs={12} sm={4}>
                    <Typography variant='h6' className='header-text-light'>
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Box className='ratings'>
                    <Rating
                        emptySymbol='fa fa-star-o fa-2x'
                        fullSymbol='fa fa-star fa-2x'
                        fractions={100}
                        initialRating={getInitialRating(challenge)}
                        readonly
                    />
                    </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                    <Typography variant='h6' className='header-text-light-right'>
                        Points: {challenge.points}
                    </Typography>
                </Grid>
            </Grid>

            <Box sx={{background: theme.palette.primary.main, width: '100%', display: 'grid'}}>
                <Grid item container xs={12}>
                    <Grid item xs={12}>
                        <Paper sx={{ background: theme.palette.primary.main, width: '100%', padding: 0, margin: 0 }}>
                            {challenge.image && (
                                <Box
                                    onClick={handleImageClick}
                                    sx={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: 0,
                                        margin: 0,
                                        '& img': {
                                            maxWidth: '100%',
                                            maxHeight: '500px',
                                            borderRadius: '4px',
                                        },
                                    }}
                                >
                                    <img
                                        alt={`image-${challenge.url}`}
                                        src={challenge.image}
                                        style={{ width: 'auto', height: 'auto' }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    </Grid>

                    <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg">
                        <IconButton
                            onClick={handleCloseDialog}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <img src={challenge.image} alt={`image-${challenge.url}`} style={{width: '100%'}}/>
                    </Dialog>

                    {!isAuthor ? (
                        <>
                            {currentUser.challenges[challenge.url] && (
                                <Grid item xs={12}>
                                    {challenge.ratings[currentUser.userID] && (
                                        <Typography variant='h5' className='header-text-light'>
                                            You&apos;ve already done & rated this challenge. You can change your vote
                                            anytime.
                                        </Typography>
                                    )}
                                    {!challenge.ratings[currentUser.userID] && (
                                        <Typography variant='h5' className='header-text-light'>
                                            Good Job! You&apos;ve successfully completed this challenge. You can now
                                            rate it.
                                        </Typography>
                                    )}
                                </Grid>
                            )}
                            {!currentUser.challenges[challenge.url] && (
                                <>
                                    <Grid item xs={12} sm={6}>
                                        <Box p={2}>
                                            {!success && (
                                                <TextField
                                                    error={error}
                                                    helperText={
                                                        error ? 'Unfortunately, that is not the correct answer. Try again!' : ''
                                                    }
                                                    inputRef={keyRef}
                                                    placeholder='Enter the answer here'
                                                    variant='outlined'
                                                    fullWidth
                                                    className={classes.input}
                                                    InputProps={{classes: {input: classes.input}}}
                                                    onKeyUp={kliknietyEnter}
                                                />
                                            )}
                                            {success && (
                                                <ThemeProvider theme={successTheme}>
                                                    <TextField
                                                        error={success}
                                                        helperText={success ? 'Your page will refresh in a few seconds...' : ''}
                                                        value='Congratulations! You have captured the flag!'
                                                        variant='outlined'
                                                        fullWidth
                                                        className={classes.input}
                                                        InputProps={{classes: {input: classes.input}}}
                                                    />
                                                </ThemeProvider>
                                            )}
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
                                                disabled={loading || success}
                                                sx={{background: theme.palette.primary.light}}
                                                onClick={checkKey}
                                            >
                                                Submit Flag
                                            </Button>
                                        </Box>
                                    </Grid>
                                </>
                            )}
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant='h5' className='header-text-dark'
                                        style={{
                                            borderTop: 'none'
                                        }}>
                                As the author of this challenge, you cannot respond to it.
                            </Typography>
                        </Grid>

                    )}
                </Grid>
            </Box>

            {currentUser.challenges[challenge.url] && (
                <Grid item xs={12}>
                    <Box className='header-text-gold'>
                        {isMobile ? (
                            <Grid container direction='column' alignItems='center'>
                                <Grid item>
                                    <Typography variant='h6' style={{color: 'white', textAlign: 'center'}}>
                                        Rate This Challenge:
                                    </Typography>
                                </Grid>
                                <Grid >
                                    <Rating
                                        emptySymbol='fa fa-star-o fa-2x'
                                        fullSymbol='fa fa-star fa-2x'
                                        fractions={2}
                                        initialRating={
                                            challenge.ratings[currentUser.userID]
                                                ? challenge.ratings[currentUser.userID]
                                                : 5
                                        }
                                        onClick={handleRating}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <>
                                <Typography variant='h6' style={{color: 'white'}}>
                                    Rate This Challenge:
                                </Typography>
                                <Box ml={2} />
                                <Rating
                                    emptySymbol='fa fa-star-o fa-2x'
                                    fullSymbol='fa fa-star fa-2x'
                                    fractions={2}
                                    initialRating={
                                        challenge.ratings[currentUser.userID]
                                            ? challenge.ratings[currentUser.userID]
                                            : 5
                                    }
                                    onClick={handleRating}
                                />
                            </>
                        )}
                    </Box>
                </Grid>
            )}

        </StyledGrid>
    );
}

ChallengePage.propTypes = {
    challenge: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};
