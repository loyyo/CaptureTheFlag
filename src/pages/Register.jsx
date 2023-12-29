import React, { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	TextField,
	Grid,
	CssBaseline,
	Button,
	Collapse,
	Container,
	Typography,
	IconButton,
	Box,
	Link,
	Alert,
	AlertTitle,
	Paper,
	useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function SignUp() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmationRef = useRef();

	const { signup } = useAuth();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
			return setError('Passwords do not match');
		}

		if (usernameRef.current.value.length < 3 || usernameRef.current.value.length > 10) {
			return setError('Username must be between 5 and 10 characters');
		}

		if (!emailRef.current.value.includes('@') || !emailRef.current.value.includes('.')) {
			return setError('Please enter a valid email address');
		}

		if (passwordRef.current.value.length < 6) {
			return setError('Password must be at least 6 characters long');
		}

		try {
			setLoading(true);
			setError('');
			await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);
			setSuccess(true);
			navigate('/profile');
		} catch {
			setError('Failed to create an account');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container
			component='main'
			maxWidth='xs'
			sx={{
				mt: 2,
				mb: 2,
				minHeight: isMobile ? '86.8vh' : '90.4vh',
			}}
		>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: isMobile ? 'center' : 'flex-start',
				}}
			>
				<Paper elevation={0} sx={{ padding: theme.spacing(3), width: '100%', mt: 3, mb: 3 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<Typography component='h1' variant='h4'>
							Sign up
						</Typography>
						<Box mt={3} sx={{ width: '100%' }}>
							<form onSubmit={handleSubmit}>
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
												You have created your profile. Redirecting...
											</Alert>
										</Collapse>
									</Box>
								)}
								<Grid container spacing={2}>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											id='username'
											label='Username'
											name='username'
											autoComplete='username'
											inputRef={usernameRef}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											id='email'
											label='Email Address'
											name='email'
											autoComplete='email'
											inputRef={emailRef}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											name='password'
											label='Password'
											type='password'
											id='password'
											autoComplete='current-password'
											inputRef={passwordRef}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											variant='outlined'
											required
											fullWidth
											name='passwordConfirmation'
											label='Password Confirmation'
											type='password'
											id='passwordConfirmation'
											autoComplete='current-password'
											inputRef={passwordConfirmationRef}
										/>
									</Grid>
								</Grid>
								<Button
									type='submit'
									fullWidth
									variant='contained'
									color='primary'
									sx={{ mt: 2, mb: 2 }}
									disabled={loading}
								>
									Sign Up
								</Button>
								<Grid container justifyContent='flex-end'>
									<Grid item>
										<Link underline='hover' component={RouterLink} to='/login'>
											Already have an account? Sign in
										</Link>
									</Grid>
								</Grid>
							</form>
						</Box>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
