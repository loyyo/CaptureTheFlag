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

    const paperStyle = {
        backgroundColor: 'light',
        borderRadius: '4px',
        padding: 2,
        margin: 1,
    };

    return (
        <Grid container direction='column'>
            <Paper elevation={3} sx={{ backgroundColor: 'light', borderRadius: '4px', mt: 1 }}>
                {/* Title */}
                <Grid item xs={12}>
                    <Typography variant='h4' align="center">
                        {challenge.title}
                    </Typography>
                </Grid>

                {/* Combined Section: Description, Difficulty, Points, Rating, Image */}
                <Grid item xs={12}>
                    <Paper sx={{ backgroundColor: 'light', borderRadius: '4px', padding: 2, margin: 1 }}>
                        {/* Description */}
                        <Typography variant='h5' align="center">
                            {challenge.description}
                        </Typography>
                        <Divider sx={{marginY: 2}}/>

                        {/* Difficulty, Points, and Rating */}
                        <Box display="flex" justifyContent="space-evenly">
                            <Typography variant='h6'>
                                Difficulty: {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </Typography>
                            <Typography variant='h6'>
                                Points: {challenge.points}
                            </Typography>
                            <Box>
                                <Rating
                                    emptySymbol='fa fa-star-o fa-2x'
                                    fullSymbol='fa fa-star fa-2x'
                                    fractions={100}
                                    initialRating={getInitialRating(challenge)}
                                    readonly
                                />
                            </Box>
                        </Box>
                        <Divider sx={{marginY: 2}}/>

                        {/* Image */}
                        {challenge.image && (
                            <Box onClick={handleImageClick}
                                 sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'center' }}>
                                <img alt={`image-${challenge.url}`} src={challenge.image}
                                     style={{ maxWidth: '100%', maxHeight: '500px' }}/>
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

                {!isAuthor && (
                    <>
                        {currentUser.challenges[challenge.url] ? (
                            <Grid item xs={12}>
                                <Paper sx={{backgroundColor: 'light', borderRadius: '4px', padding: 2, margin: 1}}>
                                    <Typography variant='h6' align="center">
                                        {challenge.ratings[currentUser.userID]
                                            ? "You've already done & rated this challenge. You can change your vote anytime."
                                            : "Good Job! You've successfully completed this challenge. You can now rate it."
                                        }
                                    </Typography>
                                </Paper>
                            </Grid>
                        ) : (
                            <Grid item xs={12}>
                                <Paper sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'light', borderRadius: '4px', padding: 2, margin: 1}}>
                                    {!success ? (
                                        <TextField
                                            error={error}
                                            helperText={error ? 'Unfortunately, that is not the correct answer. Try again!' : ''}
                                            inputRef={keyRef}
                                            placeholder='Enter the answer here'
                                            variant='outlined'
                                            fullWidth
                                            onKeyUp={e => e.key === 'Enter' && checkKey()}
                                        />
                                    ) : (
                                        <Typography variant='h6' align="center">
                                            Congratulations! Your page will refresh in a few seconds...
                                        </Typography>
                                    )}
                                    <Button
                                        type='button'
                                        variant='contained'
                                        color='primary'
                                        disabled={loading || success}
                                        onClick={checkKey}
                                    >
                                        Submit Answer
                                    </Button>
                                </Paper>
                            </Grid>
                        )}
                    </>
                )}


                {/* Author's View */}
                {isAuthor && (
                    <Grid item xs={12}>
                        <Paper sx={{backgroundColor: 'light', borderRadius: '4px', padding: 2, margin: 1}}>
                            <Typography variant='h6' align="center">
                                As the author of this challenge, you cannot respond to it.
                            </Typography>
                        </Paper>
                    </Grid>
                )}

                {/* Rating Section */}
                {currentUser.challenges[challenge.url] && (
                    <Grid item xs={12}>
                        <Paper sx={{ backgroundColor: 'light', borderRadius: '4px', padding: 2, margin: 1 }}>
                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                <Typography variant='h6' align="center" sx={{ marginBottom: 1 }}>
                                    Rate This Challenge:
                                </Typography>
                                <Rating
                                    emptySymbol='fa fa-star-o fa-2x'
                                    fullSymbol='fa fa-star fa-2x'
                                    fractions={2}
                                    initialRating={
                                        challenge.ratings[currentUser.userID] ? challenge.ratings[currentUser.userID] : 0
                                    }
                                    onClick={handleRating}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                )}
            </Paper>
        </Grid>
    );
}

ChallengePage.propTypes = {
    challenge: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};
