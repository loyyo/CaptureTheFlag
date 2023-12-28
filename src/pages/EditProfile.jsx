import React, { useRef, useState, useEffect } from 'react';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Button,
	TextField,
	LinearProgress,
	Collapse,
	IconButton,
	Alert,
	AlertTitle,
	Divider,
	Paper,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Close as CloseIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dropzone from '../components/Dropzone';

export default function EditProfile() {
	const navigate = useNavigate();

	const emailRef = useRef();
	const bioRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
	const currentPasswordRef = useRef();
	const passwordConfirmationRef = useRef();

	const {
		currentUser,
		updateEmail,
		updatePassword,
		currentUserData,
		getProfile,
		updateUsername,
		updateBio,
		updateAvatar,
		currentPassword,
		logout,
		getAllUsersData,
	} = useAuth();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [file, setFile] = useState([]);
	const [image, setImage] = useState();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

	async function handleSubmit(e) {
		e.preventDefault();

		setError('');
		setSuccess(false);

		if (
			(passwordRef.current.value || passwordConfirmationRef.current.value) &&
			!currentPasswordRef.current.value
		) {
			setError('Current password is required when changing the password.');
			return;
		}

		if (usernameRef.current.value.length < 5 || usernameRef.current.value.length > 10) {
			setError('Username must be between 5 and 10 characters');
			return;
		}

		if (!emailRef.current.value.includes('@') || !emailRef.current.value.includes('.')) {
			setError('Email address is not valid');
			return;
		}

		if (passwordRef.current.value && passwordRef.current.value.length < 6) {
			setError('Password must be at least 6 characters');
			return;
		}

		if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
			setError('Passwords do not match');
			return;
		}

		if (bioRef.current.value.length > 300) {
			setError('Biography must be less than 300 characters');
			return;
		}

		if (currentPasswordRef.current.value) {
			const isPasswordCorrect = await currentPassword(currentPasswordRef.current.value);
			if (!isPasswordCorrect) {
				setError('Current password is incorrect');
				return;
			}
		}

		const promises = [];

		if (emailRef.current.value !== currentUser.email) {
			try {
				await updateEmail(emailRef.current.value);
				await getProfile();
			} catch (error) {
				if (error.code === 'auth/requires-recent-login') {
					setError('Please log in again to update your email.');
					logout();
					localStorage.setItem('loginReason', 'requires-recent-login');
					// navigate("/login", { state: { reason: "requires-recent-login" } });
					navigate('/login');
					return;
				} else {
					setError('Failed to update email. ' + error.message);
					return;
				}
			}
		}

		if (usernameRef.current.value !== currentUserData.username) {
			promises.push(updateUsername(currentUser.email, usernameRef.current.value));
		}

		if (bioRef.current.value !== currentUserData.bio) {
			promises.push(updateBio(currentUser.email, bioRef.current.value));
		}

		if ((file && file.path !== currentUserData.avatar) || !file) {
			promises.push(updateAvatar(currentUser.email, file));
		}

		if (passwordRef.current.value) {
			promises.push(updatePassword(passwordRef.current.value));
		}

		Promise.all(promises)
			.then(() => {
				setSuccess(true);
				navigate('/profile');
			})
			.catch((error) => {
				setError('An error occurred while updating profile. ' + error.message);
			})
			.finally(() => {
				getProfile();
				getAllUsersData();
			});
	}

	const handleCancel = () => {
		navigate('/profile');
	};

	useEffect(() => {
		if (!currentUserData) {
			getProfile();
		}
	});

	useEffect(() => {
		if (currentUserData && currentUserData.avatar) {
			setImage(currentUserData.avatar);
		}
	}, [currentUserData]);

	if (!currentUserData) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						height: 'calc(100vh - 90px)',
					}}
				>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<Container
			component='main'
			maxWidth='lg'
			sx={{
				mt: 2,
				mb: isMobile ? 8 : 0,
				height: isMobile ? 'auto' : 'calc(100vh - 90px)',
			}}
		>
			<CssBaseline />
			<Box
				mt={5}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Paper
					elevation={7}
					sx={{
						padding: 2,
						borderRadius: '4px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Typography variant='h4' gutterBottom>
						Edit Profile
					</Typography>

					<Box component='form' onSubmit={handleSubmit} sx={{ width: '100%', mt: 3 }}>
						{error && (
							<Box mt={-1} mb={2}>
								<Alert variant='outlined' severity='error'>
									<AlertTitle>An error occured:</AlertTitle>
									{error}
								</Alert>
							</Box>
						)}
						{success && (
							<Box mt={-1} mb={2}>
								<Collapse in={success}>
									<Alert
										variant='outlined'
										severity='success'
										action={
											<IconButton
												aria-label='close'
												color='inherit'
												size='small'
												onClick={() => {
													setSuccess(false);
												}}
											>
												<CloseIcon fontSize='inherit' />
											</IconButton>
										}
									>
										<AlertTitle>Success!</AlertTitle>
										You have changed your profile.
									</Alert>
								</Collapse>
							</Box>
						)}
						<Grid container rowSpacing={3} alignItems='stretch'>
							{isMobile ? (
								// Mobile View
								<>
									{/* Username */}
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											id='username'
											label='Username'
											name='username'
											autoComplete='username'
											inputRef={usernameRef}
											defaultValue={currentUserData.username}
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>

									{/* Email */}
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											id='email'
											label='Email Address'
											name='email'
											autoComplete='email'
											inputRef={emailRef}
											defaultValue={currentUser.email}
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>

									{/* Avatar */}
									<Grid item xs={12}>
										<Dropzone image={image} setImage={setImage} file={file} setFile={setFile} />
									</Grid>

									{/* Biography */}
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											id='biography'
											label='Biography'
											name='biography'
											multiline
											rows={4}
											inputRef={bioRef}
											defaultValue={currentUserData.bio}
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>

									<Grid item xs={12}>
										<Divider
											orientation='horizontal'
											sx={{ width: '100%', my: 1, border: '1px solid #252028' }}
										/>
									</Grid>

									{/* Password Fields */}
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											name='currentPassword'
											label='Current Password'
											type='password'
											id='currentPassword'
											autoComplete='current-password'
											inputRef={currentPasswordRef}
											helperText='*Required when changing the password'
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											name='password'
											label='New Password'
											type='password'
											id='password'
											autoComplete='new-password'
											inputRef={passwordRef}
											helperText='*Leave blank to keep the same'
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											name='passwordConfirmation'
											label='Confirm New Password'
											type='password'
											id='passwordConfirmation'
											autoComplete='new-password'
											inputRef={passwordConfirmationRef}
											helperText='*Leave blank to keep the same'
											sx={{
												mb: 2,
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>
								</>
							) : (
								// Desktop View
								<>
									{/* Left Column: Username, Email, Avatar */}
									<Grid sx={{ marginLeft: '2rem', marginRight: '-2rem' }} item xs={12} sm={5}>
										<TextField
											variant='outlined'
											fullWidth
											id='username'
											label='Username'
											name='username'
											autoComplete='username'
											inputRef={usernameRef}
											defaultValue={currentUserData.username}
											sx={{
												mb: 2,
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
										<TextField
											variant='outlined'
											fullWidth
											id='email'
											label='Email Address'
											name='email'
											autoComplete='email'
											inputRef={emailRef}
											defaultValue={currentUser.email}
											sx={{
												mb: 2,
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
										<Dropzone image={image} setImage={setImage} file={file} setFile={setFile} />
									</Grid>

									{/* Vertical Divider (Desktop) */}
									<Grid item sm={2} sx={{ display: 'flex', justifyContent: 'center' }}>
										<Divider orientation='vertical' sx={{ height: '100%' }} />
									</Grid>

									{/* Right Column: Password Fields, Biography */}
									<Grid sx={{ marginRight: '2rem', marginLeft: '-2rem' }} item xs={12} sm={5}>
										<TextField
											variant='outlined'
											fullWidth
											name='currentPassword'
											label='Current Password'
											type='password'
											id='currentPassword'
											autoComplete='current-password'
											inputRef={currentPasswordRef}
											sx={{
												mb: 2,
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
											helperText='*Required when changing the password'
										/>
										<TextField
											variant='outlined'
											fullWidth
											name='password'
											label='New Password'
											type='password'
											id='password'
											autoComplete='new-password'
											inputRef={passwordRef}
											sx={{
												mb: 2,
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
											helperText='*Leave blank to keep the same'
										/>
										<TextField
											variant='outlined'
											fullWidth
											name='passwordConfirmation'
											label='Confirm New Password'
											type='password'
											id='passwordConfirmation'
											autoComplete='new-password'
											inputRef={passwordConfirmationRef}
											helperText='*Leave blank to keep the same'
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>
									<Grid sx={{ marginLeft: '2rem', marginRight: '2rem' }} item xs={12}>
										<TextField
											variant='outlined'
											fullWidth
											id='biography'
											label='Biography'
											name='biography'
											multiline
											rows={4}
											inputRef={bioRef}
											defaultValue={currentUserData.bio}
											sx={{
												'& .MuiOutlinedInput-root': {
													'& fieldset': {
														borderColor: '#252028',
														borderWidth: '2px',
													},
													'&:hover fieldset': {
														borderWidth: '3px',
													},
												},
											}}
										/>
									</Grid>
								</>
							)}
						</Grid>

						{/* Buttons */}
						<Box
							sx={{
								width: '100%',
								mt: 3,
								display: 'flex',
								flexDirection: isMobile ? 'column' : 'row',
								justifyContent: 'center',
							}}
						>
							<Button
								onClick={handleCancel}
								variant='outlined'
								color='secondary'
								sx={{ mb: isMobile ? 2 : 0, mr: isMobile ? 0 : 2 }}
							>
								Cancel
							</Button>
							<Button type='submit' variant='contained'>
								Save Changes
							</Button>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
