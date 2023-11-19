import { useState, useRef, useEffect } from 'react';
import { createTheme, ThemeProvider, styled, useTheme } from '@mui/material/styles';
import { Grid, Box, Typography, Button, TextField, Paper, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { green } from '@mui/material/colors';
import PropTypes from 'prop-types';

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
	const { doChallenge } = useAuth();

	async function checkKey() {
		if (loading) {
			return;
		} else if (
			keyRef.current.value.toLowerCase() !== challenge[0].key.toLowerCase() &&
			keyRef.current.value.toLowerCase() !== challenge[0].key2.toLowerCase()
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
	}

	const kliknietyEnter = (e) => {
		if (e.key === 'Enter') {
			checkKey();
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
						{challenge[0].points} Points
					</Typography>
				</Grid>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' className='header-text-light-right'>
						Category: {challenge[0].category}
					</Typography>
				</Grid>
			</Grid>

			<Box sx={{ background: theme.palette.primary.main, width: '100%', display: 'grid' }}>
				<Grid item container xs={12}>
					<Grid item xs={12}>
						<Paper sx={{ background: theme.palette.primary.main, width: '100%', display: 'grid' }}>
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
									width: { xs: 250, sm: 350, md: 500 },
								}}
								alt={`flag-${challenge[0].url}`}
								src={challenge[0].flag}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12}>
						{currentUser.challenges[challenge[0].url] && (
							<Typography variant='h5' className='header-text-dark'>
								You&apos;ve successfully completed this challenge.
							</Typography>
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
											className={classes.input}
											InputProps={{ classes: { input: classes.input } }}
											onKeyPress={kliknietyEnter}
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
