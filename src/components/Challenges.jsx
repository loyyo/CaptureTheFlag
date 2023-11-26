import React from 'react';
import {useTheme} from '@mui/material/styles';
import {Grid, Box, Typography, Button, Paper, Checkbox} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

export default function Challenges({ allChallengesData, currentUserData }) {
	const navigate = useNavigate();
	const theme = useTheme();

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

    return (
        <Grid container>
            {allChallengesData.map((challenge) => (
                <Grid item xs={12} sm={6} md={4} key={challenge.url}>
                    <Box m={1}>
                        <Paper elevation={3}>
                            <Grid container direction='column'>
                                <Grid item>
                                    <Typography variant='h5' className='header-text'>
                                        {challenge.title}
                                        {currentUserData.challenges[challenge.url] && (
                                            <Checkbox
                                                edge='end'
                                                checked={true}
                                                disabled
                                                style={{marginBottom: '-0.45rem', marginTop: '-0.55rem'}}
                                                color='primary'
                                            />
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid container item>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant='h6' className='header-text-light'>
                                            {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant='h6' className='header-text-light-right'>
                                            Completed by: {challenge.completedBy}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', background: theme.palette.primary.dark }}>
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            sx={{ margin: 1, color: 'white', borderColor: 'red' }}
                                            onClick={() => navigate(`/challenges/${challenge.url}`)}
                                        >
                                            View
                                        </Button>
                                        {currentUserData.userID === challenge.userID && (
                                            <Button
                                                variant='contained'
                                                color='primary'
                                                sx={{ margin: 1, color: 'white', borderColor: 'transparent' }}
                                                onClick={() => navigate(`/challenges/${challenge.url}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                        )}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Box>
                </Grid>
            ))}
        </Grid>
    );
}

Challenges.propTypes = {
	allChallengesData: PropTypes.array.isRequired,
	currentUserData: PropTypes.object.isRequired,
};
