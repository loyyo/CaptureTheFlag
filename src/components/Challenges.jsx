import {useTheme} from '@mui/material/styles';
import {Grid, Box, Typography, Button, Paper, Checkbox, Divider} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

export default function Challenges({allChallengesData, currentUserData}) {
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

    const getDaysAgo = (timestamp) => {
        const createdAtDate = new Date(timestamp.seconds * 1000);
        const createdAtMidnight = new Date(createdAtDate.getFullYear(), createdAtDate.getMonth(), createdAtDate.getDate());

        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);

        const differenceInTime = todayMidnight - createdAtMidnight;
        const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

        return differenceInDays;
    };


    return (
        <Grid container justifyContent="center">
            {allChallengesData.map((challenge) => (
                <Grid item xs={12} sm={6} md={4} key={challenge.url}>
                    <Box m={1}>
                        <Paper elevation={3} sx={{backgroundColor: 'light', borderRadius: '4px'}}>
                            <Box sx={{padding: '15px 0 0 0'}}>
                                {/* Title */}
                                <Typography variant='h5' align="left" className="ellipsis" sx={{marginLeft: '20px'}}>
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

                                {/* Difficulty and Popularity */}
                                <Box display="flex" justifyContent="flex-start" alignItems="center"
                                     sx={{marginLeft: '20px', marginTop: '8px'}}>
                                    <Typography variant='h6'>
                                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                    </Typography>
                                    <span style={{
                                        height: '8px',
                                        width: '8px',
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        margin: '0 10px',
                                        verticalAlign: 'middle'
                                    }}></span>
                                    <Typography variant='h6'>
                                        Popularity: {challenge.completedBy}
                                    </Typography>
                                </Box>

                                {/* username and createdAt */}
                                <Box display="flex" justifyContent="flex-start" alignItems="center"
                                     sx={{marginLeft: '20px', marginBottom: '15px'}}>
                                    <Typography variant='h6'>
                                        {challenge.username}
                                    </Typography>
                                    <span style={{
                                        height: '8px',
                                        width: '8px',
                                        backgroundColor: theme.palette.primary.main,
                                        borderRadius: '50%',
                                        display: 'inline-block',
                                        margin: '0 10px',
                                        verticalAlign: 'middle'
                                    }}></span>
                                    <Typography variant='h6'>
                                        {getDaysAgo(challenge.createdAt)} days ago
                                    </Typography>
                                </Box>

                                {/* Rating Stars */}
                                <Box my={1} align="center" sx={{marginBottom: '10px'}}>
                                    <Rating
                                        emptySymbol={
                                            <span className="fa fa-star-o fa-2x" style={{margin: '0 8px'}}/>
                                        }
                                        fullSymbol={
                                            <span className="fa fa-star fa-2x" style={{margin: '0 8px'}}/>
                                        }
                                        fractions={100}
                                        initialRating={getInitialRating(challenge)}
                                        readonly
                                    />
                                </Box>

                                {/* View/Edit Buttons */}
                                <Box sx={{
                                    display: 'flex',
                                    borderTop: `1px solid ${theme.palette.divider}`,
                                    p: 0, // Remove padding
                                    m: 0 // Remove margin
                                }}>
                                    <Button
                                        variant='outlined'
                                        color='inherit'
                                        sx={{
                                            width: '50%',
                                            flexGrow: 1,
                                            m: 0,
                                            border: 'none',
                                            backgroundColor: 'light',
                                            '&:hover': {
                                                backgroundColor: 'light',
                                            }
                                        }}
                                        onClick={() => navigate(`/challenges/${challenge.url}`)}
                                    >
                                        View
                                    </Button>
                                    {currentUserData.userID === challenge.userID && (
                                        <Button
                                            variant='outlined'
                                            color='inherit'
                                            sx={{
                                                width: '50%',
                                                flexGrow: 1,
                                                m: 0,
                                                border: 'none',
                                                borderTopLeftRadius: 0,
                                                borderTopRightRadius: 0,
                                                borderBottomLeftRadius: 0,
                                                color: 'white',
                                                borderLeft: `1px solid ${theme.palette.divider}`,
                                                backgroundColor: theme.palette.primary.main,
                                                '&:hover': {
                                                    backgroundColor: 'light',
                                                }
                                            }}
                                            onClick={() => navigate(`/challenges/${challenge.url}/edit`)}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                </Box>


                            </Box>
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
