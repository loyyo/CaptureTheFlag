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
        <Grid container>
            {allChallengesData.map((challenge) => (
                <Grid item xs={12} sm={6} md={4} key={challenge.url}>
                    <Box m={1}>
                        <Paper elevation={3} sx={{backgroundColor: 'light', borderRadius: '4px'}}>
                            <Box p={2}>
                                {/* Title */}
                                <Typography variant='h5' align="center" className="ellipsis">
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
                                <Box display="flex" justifyContent="space-evenly">
                                    <Typography variant='h6'>
                                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                                    </Typography>
                                    <Typography variant='h6'>
                                        Popularity: {challenge.completedBy}
                                    </Typography>
                                </Box>

                                {/* Created At */}
                                <Typography variant='h6' align="center">
                                    {getDaysAgo(challenge.createdAt)} days ago
                                </Typography>

                                {/* Rating Stars */}
                                <Box my={1} align="center">
                                    <Rating
                                        emptySymbol='fa fa-star-o fa-2x'
                                        fullSymbol='fa fa-star fa-2x'
                                        fractions={100}
                                        initialRating={getInitialRating(challenge)}
                                        readonly
                                    />
                                </Box>

                                {/* Horizontal Line */}
                                <Divider sx={{marginY: 2}}/>

                                {/* View/Edit Buttons */}
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <Button
                                        variant='outlined'
                                        color='inherit'
                                        sx={{margin: 1, width: '100%'}}
                                        onClick={() => navigate(`/challenges/${challenge.url}`)}
                                    >
                                        View
                                    </Button>
                                    {currentUserData.userID === challenge.userID && (
                                        <Button
                                            variant='outlined'
                                            color='inherit'
                                            sx={{
                                                margin: 1,
                                                width: '100%',
                                                // background: theme.palette.primary.light
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
