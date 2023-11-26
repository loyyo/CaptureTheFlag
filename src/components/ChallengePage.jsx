import { useState, useRef, useEffect } from 'react';
import { createTheme, ThemeProvider, styled, useTheme } from '@mui/material/styles';
import { Grid, Box, Typography, Button, TextField, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { green } from '@mui/material/colors';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

const PREFIX = 'ChallengePage';
const classes = {
	input: `${PREFIX}-input`,
};
const StyledGrid = styled(Grid)(({ theme }) => ({
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

export default function ChallengePage({ challenge, currentUser }) {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const keyRef = useRef();
	const theme = useTheme();

	const navigate = useNavigate();
	const { doChallenge, rateChallenge } = useAuth();

	const checkKey = async () => {
		if (loading) {
			return;
		} else if (
			keyRef.current.value.toLowerCase() !== challenge[0].key.toLowerCase()
		) {
			setError(true);
		} else {
			try {
				setError(false);
				setLoading(true);
				await doChallenge(
					challenge[0].url,
					challenge[0].points,
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
			await rateChallenge(value, challenge[0].url, currentUser.userID);
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
					{challenge[0].title}
				</Typography>
				<Divider />
			</Grid>
			<Grid container item xs={12}>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' className='header-text-light'>
						{challenge[0].difficulty.charAt(0).toUpperCase() + challenge[0].difficulty.slice(1)}
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' className='header-text-light-right'>
						Completed by: {challenge[0].completedBy}
					</Typography>
				</Grid>
			</Grid>

			{!currentUser.challenges[challenge[0].url] && (
				<Grid item xs={12}>
					<Box className='ratings'>
						<Typography variant='h6' style={{ color: 'white' }}>
							Community Ranking:
						</Typography>
						<Box ml={2} />
						<Rating
							emptySymbol='fa fa-star-o fa-2x'
							fullSymbol='fa fa-star fa-2x'
							fractions={100}
							initialRating={getInitialRating(challenge[0])}
							readonly
						/>
					</Box>
				</Grid>
			)}

			{currentUser.challenges[challenge[0].url] && (
				<Grid item xs={12}>
					<Box className='ratings'>
						<Typography variant='h6' style={{ color: 'white' }}>
							Rate This Challenge:
						</Typography>
						<Box ml={2} />
						<Rating
							emptySymbol='fa fa-star-o fa-2x'
							fullSymbol='fa fa-star fa-2x'
							fractions={2}
							initialRating={
								challenge[0].ratings[currentUser.email]
									? challenge[0].ratings[currentUser.email]
									: 5
							}
							onClick={handleRating}
						/>
					</Box>
				</Grid>
			)}

			<Box sx={{ background: theme.palette.primary.main, width: '100%', display: 'grid' }}>
				<Grid item container xs={12}>
					<Grid item xs={12}>
						<Paper sx={{background: theme.palette.primary.main, width: '100%', display: 'grid'}}>
							{challenge[0].image && (
								<Box
									style={{
										marginLeft: 'auto',
										marginRight: 'auto',
										marginTop: '0.5rem',
										marginBottom: '0.5rem',
									}}
									component='img'
									sx={{
										height: 'auto',
										width: {xs: 250, sm: 350, md: 500},
									}}
									alt={`image-${challenge[0].url}`}
									src={challenge[0].image}
								/>
							)}
						</Paper>
						)
					</Grid>
					{currentUser.challenges[challenge[0].url] && (
						<Grid item xs={12}>
							{challenge[0].ratings[currentUser.userID] && (
								<Typography variant='h5' className='header-text-dark'>
									You&apos;ve already done & rated this challenge. You can change your vote anytime.
								</Typography>
							)}
							{!challenge[0].ratings[currentUser.userID] && (
								<Typography variant='h5' className='header-text-dark'>
									Good Job! You&apos;ve successfully completed this challenge. You can now rate it.
								</Typography>
							)}
						</Grid>
					)}
					{!currentUser.challenges[challenge[0].url] && (
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
											placeholder='Enter the country here'
											variant='outlined'
											fullWidth
											className={classes.input}
											InputProps={{ classes: { input: classes.input } }}
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
												InputProps={{ classes: { input: classes.input } }}
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
										sx={{ background: theme.palette.primary.light }}
										onClick={checkKey}
									>
										Submit Flag
									</Button>
								</Box>
							</Grid>
						</>
					)}
				</Grid>
			</Box>
		</StyledGrid>
	);
}

ChallengePage.propTypes = {
	challenge: PropTypes.object.isRequired,
	currentUser: PropTypes.object.isRequired,
};
