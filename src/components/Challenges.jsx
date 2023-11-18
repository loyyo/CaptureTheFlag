import { makeStyles } from '@mui/styles';
import { Grid, Box, Typography, Button, Paper, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
	button: {
		background: theme.palette.primary.dark,
	},
}));

export default function Challenges({ category, allChallengesData, currentUserData }) {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<Grid container>
			{allChallengesData.map((e) => {
				if (category === e.category || category === 'all') {
					return (
						<Grid item xs={12} sm={6} md={4} key={e.url}>
							<Box m={1}>
								<Paper elevation={3}>
									<Grid container direction='column'>
										<Grid item>
											{currentUserData.challenges[e.url] && (
												<Typography variant='h5' className='leaderboard-header'>
													{e.title}
													<div style={{ display: 'inline-block' }} title='Challenge passed'>
														<Checkbox
															edge='end'
															checked={true}
															disabled
															style={{ marginBottom: '-0.45rem', marginTop: '-0.55rem' }}
															color='primary'
														/>
													</div>
												</Typography>
											)}
											{!currentUserData.challenges[e.url] && (
												<Typography variant='h5' className='leaderboard-header'>
													{e.title}
												</Typography>
											)}
										</Grid>
										<Grid container item>
											<Grid item xs={12} md={6}>
												<Typography variant='body1' className='leaderboard-light'>
													{e.points} Points
												</Typography>
											</Grid>
											<Grid item xs={12} md={6}>
												<Typography variant='body1' className='leaderboard-light-right'>
													Category: {e.category}
												</Typography>
											</Grid>
										</Grid>
										<Grid item xs={12}>
											<Button
												type='button'
												fullWidth
												variant='contained'
												color='primary'
												className={classes.button}
												onClick={() => {
													navigate(`/challenges/${e.url}`);
												}}
											>
												View
											</Button>
										</Grid>
									</Grid>
								</Paper>
							</Box>
						</Grid>
					);
				} else {
					return null;
				}
			})}
		</Grid>
	);
}

Challenges.propTypes = {
	category: PropTypes.string.isRequired,
	allChallengesData: PropTypes.array.isRequired,
	currentUserData: PropTypes.object.isRequired,
};
