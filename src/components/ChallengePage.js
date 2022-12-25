import React, { useState, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@mui/material/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { useAuth } from '../contexts/AuthContext';
import Rating from 'react-rating';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
	info: {
		background: theme.palette.primary.main,
		width: '100%',
		display: 'grid',
	},
	button: {
		background: theme.palette.primary.light,
	},
	input: {
		'&::placeholder': {
			color: 'white',
			textAlign: 'center',
		},
		color: 'white',
		background: theme.palette.primary.light,
	},
}));

const theme = createTheme({
	palette: {
		error: green,
	},
});

export default function ChallengePage({ challenge, currentUser }) {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const keyRef = useRef();
	const classes = useStyles();
	const navigate = useNavigate();
	const { doChallenge, rateChallenge } = useAuth();

	async function checkKey() {
		if (keyRef.current.value.toLowerCase() !== challenge[0].key.toLowerCase() && !loading) {
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
	}

	const kliknietyEnter = (e) => {
		if (e.key === 'Enter') {
			checkKey();
		}
	};

	const getInitialRating = (challenge) => {
		let e = challenge.ratings;
		let v = 0;
		let i = 0;
		if (Object.keys(e).length === 0) return 5;
		for (let k in e) {
			if (e.hasOwnProperty(k)) {
				v = v + e[k];
				i = i + 1;
			}
		}
		return v / i;
	};

	async function handleRating(value) {
		try {
			await rateChallenge(value, challenge[0].url, currentUser.userID);
			navigate('/challenges');
			navigate(0);
		} catch {
			console.error('Something bad happened :(');
		}
	}

	useEffect(() => {
		if (error) {
			setTimeout(() => {
				setError(!error);
			}, 5000);
		}
	}, [error]);

	return (
		<Grid container direction='column'>
			<Grid item xs={12}>
				<Typography variant='h4' className='leaderboard-header-dark'>
					{challenge[0].title}
				</Typography>
				<Divider />
			</Grid>
			<Grid container item xs={12}>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' className='leaderboard-light'>
						{challenge[0].points} Points
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' className='leaderboard-light-right'>
						Category: {challenge[0].category}
					</Typography>
				</Grid>
			</Grid>

			{!currentUser.challenges[challenge[0].url] && (
				<Grid container item xs={12} className='ratings'>
					<Typography
						variant='h6'
						style={{ color: 'white', marginRight: '0.5rem', marginLeft: '0.5rem' }}
					>
						Community Ranking:
					</Typography>
					<Rating
						emptySymbol='fa fa-star-o fa-2x'
						fullSymbol='fa fa-star fa-2x'
						fractions={100}
						initialRating={getInitialRating(challenge[0])}
						readonly
					/>
				</Grid>
			)}

			{currentUser.challenges[challenge[0].url] && (
				<Grid container item xs={12} className='ratings'>
					<Typography
						variant='h6'
						style={{ color: 'white', marginRight: '0.5rem', marginLeft: '0.5rem' }}
					>
						Rate This Challenge:
					</Typography>
					<Rating
						emptySymbol='fa fa-star-o fa-2x'
						fullSymbol='fa fa-star fa-2x'
						fractions={2}
						initialRating={
							challenge[0].ratings[currentUser.email] ? challenge[0].ratings[currentUser.email] : 5
						}
						onClick={handleRating}
					/>
				</Grid>
			)}

			<Box className={classes.info}>
				<Grid item container xs={12}>
					<Grid item xs={12}>
						<Paper className={classes.info}>
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
									width: 300,
								}}
								alt={`flag-${challenge[0].url}`}
								src={challenge[0].flag}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						{currentUser.challenges[challenge[0].url] && (
							<>
								{challenge[0].ratings[currentUser.userID] && (
									<Typography variant='h5' className='leaderboard-header-dark'>
										You've already done & rated this challenge! You can change your vote anytime
										(◕‿◕✿)
									</Typography>
								)}
								{!challenge[0].ratings[currentUser.userID] && (
									<Typography variant='h5' className='leaderboard-header-dark'>
										GG WP! You've successfully completed this challenge. You can now rate it :-) ☝
									</Typography>
								)}
							</>
						)}
					</Grid>
					{!currentUser.challenges[challenge[0].url] && (
						<>
							<Grid item xs={12} sm={6}>
								<Box p={2}>
									{!success && (
										<TextField
											error={error}
											helperText={
												error ? 'Unfortunately, that is not the correct country. Try again!' : ''
											}
											inputRef={keyRef}
											placeholder='Enter the country here'
											variant='outlined'
											fullWidth
											InputProps={{ classes: { input: classes.input } }}
											onKeyPress={kliknietyEnter}
										/>
									)}
									{success && (
										<ThemeProvider theme={theme}>
											<TextField
												error={success}
												helperText={success ? 'Your page will refresh in a few seconds...' : ''}
												value='Congratulations! You have captured the flag!'
												variant='outlined'
												fullWidth
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
										disabled={loading ? loading : success}
										className={classes.button}
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
		</Grid>
	);
}
