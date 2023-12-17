import {useState, useRef, useEffect} from 'react';
import {createTheme, ThemeProvider, styled, useTheme} from '@mui/material/styles';
import {Grid, Box, Typography, Button, TextField, Paper, Divider, Dialog, IconButton, Container} from '@mui/material';
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
        <Container component="main" maxWidth="lg" sx={{
            mt: 2,
            mb: isMobile ? 100 : 0,
            height: isMobile ? 'auto' : 'calc(100vh - 130px)'
        }}>
            <Grid container direction='column'>
                <Paper elevation={3} sx={{backgroundColor: 'light', borderRadius: '4px', padding: 2}}>
                    {/* Title */}
                    <Grid item xs={12}>
                        <Typography variant='h4' align="center">
                            {challenge.title}
                        </Typography>
                    </Grid>

                    {/* Combined Section: Description, Difficulty, Points, Rating, Image */}
                    <Grid item xs={12}>
                        <Paper sx={{backgroundColor: 'light', borderRadius: '4px', margin: 1}}>
                            {/* Description */}
                            <Typography variant='h5' align="left" sx={{borderRadius: 0, borderBottom: `1px solid ${theme.palette.divider}`, width: '100%', padding: 1}}>
                                {challenge.description}
                            </Typography>

                            {/* Difficulty, Points, and Rating */}
                            {isMobile ? (
                                <Box display="flex" flexDirection="column" alignItems="center" sx={{padding: '20px 0'}}>
                                    <Typography variant='h6'>
                                        Difficulty: {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Points: {challenge.points}
                                    </Typography>
                                    <Rating
                                        emptySymbol='fa fa-star-o fa-2x'
                                        fullSymbol='fa fa-star fa-2x'
                                        fractions={100}
                                        initialRating={getInitialRating(challenge)}
                                        readonly
                                    />
                                </Box>
                            ) : (
                                <Box display="flex" justifyContent="space-evenly" sx={{padding: 1}}>
                                    <Typography variant='h6'>
                                        Difficulty: {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Points: {challenge.points}
                                    </Typography>
                                    <Rating
                                        emptySymbol='fa fa-star-o fa-2x'
                                        fullSymbol='fa fa-star fa-2x'
                                        fractions={100}
                                        initialRating={getInitialRating(challenge)}
                                        readonly
                                    />
                                </Box>
                            )}

                            {/* Image */}
                            {challenge.image && (
                                <Box onClick={handleImageClick}
                                     sx={{cursor: 'pointer', display: 'flex', justifyContent: 'center', borderRadius: 0, borderTop: `1px solid ${theme.palette.divider}`}}>
                                    <img alt={`image-${challenge.url}`} src={challenge.image}
                                         style={{maxWidth: '100%', maxHeight: '500px'}}/>
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
                                        <Typography variant='h6' align="center">
                                            {challenge.ratings[currentUser.userID]
                                                ? "You've already done & rated this challenge. You can change your vote anytime."
                                                : (
                                                    <>
                                                        Congratulations! You won {challenge.points} points!
                                                        <Box component="div" display="block">Did you enjoy this challenge? Leave your rating!</Box>
                                                    </>
                                                )
                                            }
                                        </Typography>
                                </Grid>
                            ) : (
                                <Grid item xs={12} container spacing={2} alignItems="center" p={3}>
                                    {!success ? (
                                        <Grid item xs={12} lg={10}>
                                            <TextField
                                                error={error}
                                                helperText={error ? 'Unfortunately, that is not the correct answer. Try again!' : ''}
                                                inputRef={keyRef}
                                                placeholder='Enter the answer here'
                                                variant='outlined'
                                                fullWidth
                                                onKeyUp={e => e.key === 'Enter' && checkKey()}
                                            />
                                        </Grid>
                                    ) : (
                                        <Grid item xs={12}>
                                            <Typography variant='h6' align="center">
                                                Congratulations! Your page will refresh in a few seconds...
                                            </Typography>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} lg={2}>
                                        <Button
                                            type='button'
                                            variant='contained'
                                            color='primary'
                                            disabled={loading || success}
                                            onClick={checkKey}
                                            sx={{padding: 1.75, color: 'white', fontSize: '1.25rem'}}
                                            fullWidth
                                        >
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>

                            )}
                        </>
                    )}


                    {/* Author's View */}
                    {isAuthor && (
                        <Grid item xs={12}>
                                <Typography variant='h6' align="center">
                                    As the author of this challenge, you cannot respond to it.
                                </Typography>
                        </Grid>
                    )}

                    {/* Rating Section */}
                    {currentUser.challenges[challenge.url] && (
                        <Grid item xs={12}>
                                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" m={1}>
                                    <Rating
                                        emptySymbol={
                                            <span className="fa fa-star-o fa-2x" style={{margin: '0 8px'}}/>
                                        }
                                        fullSymbol={
                                            <span className="fa fa-star fa-2x" style={{margin: '0 8px'}}/>
                                        }
                                        fractions={2}
                                        initialRating={
                                            challenge.ratings[currentUser.userID] ? challenge.ratings[currentUser.userID] : 0
                                        }
                                        onClick={handleRating}
                                    />
                                </Box>
                        </Grid>
                    )}
                </Paper>
            </Grid>
        </Container>
    );
}

ChallengePage.propTypes = {
    challenge: PropTypes.object.isRequired,
    currentUser: PropTypes.object.isRequired,
};
