import { useState, useRef, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
	Grid,
	Box,
	Typography,
	Button,
	TextField,
	Paper,
	Divider,
	Dialog,
	IconButton,
	Container,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import PropTypes from 'prop-types';
import Rating from 'react-rating';

export default function ChallengePage({ challenge, currentUser }) {
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const keyRef = useRef();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isAuthor = currentUser.userID === challenge.userID;

	const navigate = useNavigate();
	const {
		doChallenge,
		rateChallenge,
		getAllChallengesData,
		getSingleChallengeData,
		getProfile,
		getAllUsersData,
	} = useAuth();
	const [openDialog, setOpenDialog] = useState(false);

	const titleRef = useRef(null);

	const [titleFontSize, setTitleFontSize] = useState('24px'); // Domyślna wielkość czcionki

	useEffect(() => {
		adjustTitleFontSize(); // Pierwsze wywołanie przy montowaniu
		window.addEventListener('resize', adjustTitleFontSize); // Dodanie nasłuchiwania na zmianę rozmiaru okna

		return () => window.removeEventListener('resize', adjustTitleFontSize); // Oczyszczenie nasłuchiwania
	}, []);

	const adjustTitleFontSize = () => {
		if (titleRef.current) {
			const containerWidth = titleRef.current.offsetWidth; // szerokość kontenera tytułu
			const idealFontSize = containerWidth / 10; // przykładowy współczynnik skalowania

			setTitleFontSize(idealFontSize > 24 ? 24 : idealFontSize); // Maksymalny rozmiar 24px
		}
	};

	const handleImageClick = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const checkKey = async () => {
		if (loading) {
			return;
		} else if (keyRef.current.value.toLowerCase() !== challenge.key.toLowerCase()) {
			setError(true);
		} else {
			try {
				setError(false);
				setLoading(true);
				await doChallenge(challenge.url, challenge.points, currentUser.email, currentUser.points);
				getProfile();
				getAllUsersData();
				setSuccess(true);
			} catch {
				setError(true);
				setSuccess(false);
			}
			setLoading(false);
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
			getAllChallengesData();
			getSingleChallengeData(challenge.url);
			getAllChallengesData();
			navigate('/challenges');
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
		<Container
			component='main'
			maxWidth='lg'
			sx={{
				mt: 2,
				mb: isMobile ? 8 : 0,
				height: isMobile ? 'auto' : 'calc(100vh - 130px)',
			}}
		>
			<Grid container direction='column'>
				<Paper elevation={0} sx={{ backgroundColor: 'light', borderRadius: '4px', padding: 2 }}>
					{/* Title */}
					<Grid item xs={12}>
						<Typography
							ref={titleRef}
							variant='h4'
							align='center'
							style={{ fontSize: `${titleFontSize}px` }}
						>
							{challenge.title}
						</Typography>
					</Grid>

					{/* Combined Section: Description, Difficulty, Points, Rating, Image */}
					<Grid item xs={12}>
						<Paper
							variant='outlined'
							sx={{
								backgroundColor: 'light',
								borderRadius: '4px',
								margin: 1,
								border: '2px solid #252028',
							}}
						>
							{/* Description */}
							<Typography
								variant='h5'
								align='left'
								sx={{
									borderRadius: 0,
									borderBottom: '2px solid #252028',
									width: '100%',
									padding: 1,
								}}
							>
								{challenge.description}
							</Typography>

							{/* Difficulty, Points, and Rating */}
							{isMobile ? (
								<Box
									display='flex'
									flexDirection='column'
									alignItems='center'
									sx={{ padding: '20px 0' }}
								>
									<Typography variant='h6'>
										Difficulty:{' '}
										{challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
									</Typography>
									<Typography variant='h6'>Points: {challenge.points}</Typography>
									<Rating
										emptySymbol={
											<span className='fa fa-star-o fa-2x' style={{ margin: '0 4px' }} />
										}
										fullSymbol={
											<span style={{ position: 'relative' }}>
												<span
													className='fa fa-star-o fa-2x'
													style={{ margin: '0 4px', position: 'absolute', zIndex: '2' }}
												/>
												<span
													className='fa fa-star fa-2x'
													style={{
														margin: '0 4px',
														color: theme.palette.primary.main,
														position: 'relative',
														zIndex: '1',
													}}
												/>
											</span>
										}
										fractions={100}
										initialRating={getInitialRating(challenge)}
										readonly
									/>
								</Box>
							) : (
								<Box display='flex' justifyContent='space-evenly' p={1}>
									<Typography variant='h6'>
										Difficulty:{' '}
										{challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
									</Typography>
									<Typography variant='h6'>Points: {challenge.points}</Typography>
									<Rating
										emptySymbol={
											<span className='fa fa-star-o fa-2x' style={{ margin: '0 4px' }} />
										}
										fullSymbol={
											<span style={{ position: 'relative' }}>
												<span
													className='fa fa-star-o fa-2x'
													style={{ margin: '0 4px', position: 'absolute', zIndex: '2' }}
												/>
												<span
													className='fa fa-star fa-2x'
													style={{
														margin: '0 4px',
														color: theme.palette.primary.main,
														position: 'relative',
														zIndex: '1',
													}}
												/>
											</span>
										}
										fractions={100}
										initialRating={getInitialRating(challenge)}
										readonly
									/>
								</Box>
							)}

							{/* Image */}
							{challenge.image && (
								<Box
									onClick={handleImageClick}
									sx={{
										cursor: 'pointer',
										display: 'flex',
										justifyContent: 'center',
										borderRadius: 0,
										borderTop: '2px solid #252028',
									}}
								>
									<img
										alt={`${challenge.url}`}
										src={challenge.image}
										style={{ maxWidth: '200px', maxHeight: '400px' }}
									/>
								</Box>
							)}
						</Paper>
					</Grid>

					<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='sm'>
						<IconButton
							onClick={handleCloseDialog}
							sx={{
								position: 'absolute',
								right: 8,
								top: 8,
								color: (theme) => theme.palette.grey[500],
							}}
						>
							<CloseIcon />
						</IconButton>
						<img src={challenge.image} alt={`${challenge.url}`} style={{ width: '100%' }} />
					</Dialog>

					{!isAuthor && (
						<>
							{currentUser.challenges[challenge.url] ? (
								<Grid item xs={12}>
									<Typography variant='h6' align='center'>
										{challenge.ratings[currentUser.userID] ? (
											"You've already done & rated this challenge. You can change your vote anytime."
										) : (
											<>
												Congratulations! You won {challenge.points} points!
												<Box component='div' display='block'>
													Did you enjoy this challenge? Leave your rating!
												</Box>
											</>
										)}
									</Typography>
								</Grid>
							) : (
								<Grid
									item
									xs={12}
									container
									spacing={isMobile ? 1 : 3}
									alignItems='center'
									p={isMobile ? 1.5 : 2}
								>
									{!success ? (
										<Grid item xs={12} lg={10}>
											<TextField
												error={error}
												helperText={
													error ? 'Unfortunately, that is not the correct answer. Try again!' : ''
												}
												inputRef={keyRef}
												placeholder='Enter the answer here'
												variant='outlined'
												fullWidth
												onKeyUp={(e) => e.key === 'Enter' && checkKey()}
											/>
										</Grid>
									) : (
										<Grid item xs={12}>
											<Typography variant='h6' align='center'>
												Congratulations! Your page will refresh in a few seconds...
											</Typography>
										</Grid>
									)}
									{!success && (
										<Grid item xs={12} lg={2}>
											<Button
												type='button'
												variant='contained'
												color='primary'
												disabled={loading || success}
												onClick={checkKey}
												sx={{ padding: 1.25, color: 'white', fontSize: '1.25rem' }}
												fullWidth
											>
												Submit
											</Button>
										</Grid>
									)}
								</Grid>
							)}
						</>
					)}

					{/* Author's View */}
					{isAuthor && (
						<Grid item xs={12}>
							<Typography variant='h6' align='center'>
								As the author of this challenge, you cannot respond to it.
							</Typography>
						</Grid>
					)}

					{/* Rating Section */}
					{currentUser.challenges[challenge.url] && (
						<Grid item xs={12}>
							<Box
								display='flex'
								flexDirection='column'
								alignItems='center'
								justifyContent='center'
								m={1}
							>
								<Rating
									emptySymbol={<span className='fa fa-star-o fa-2x' style={{ margin: '0 8px' }} />}
									fullSymbol={
										<span style={{ position: 'relative' }}>
											<span
												className='fa fa-star-o fa-2x'
												style={{ margin: '0 8px', position: 'absolute', zIndex: '2' }}
											/>
											<span
												className='fa fa-star fa-2x'
												style={{
													margin: '0 8px',
													color: theme.palette.primary.main,
													position: 'relative',
													zIndex: '1',
												}}
											/>
										</span>
									}
									fractions={2}
									initialRating={
										challenge.ratings[currentUser.userID]
											? challenge.ratings[currentUser.userID]
											: 0
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
