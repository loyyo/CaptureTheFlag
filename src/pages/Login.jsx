import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	TextField,
	CssBaseline,
	Button,
	Grid,
	Typography,
	Container,
	Box,
	Link,
	Alert,
	AlertTitle,
	Paper,
	useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useLocation } from 'react-router-dom';

export default function SignIn() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	const emailRef = useRef();
	const passwordRef = useRef();

	const { login } = useAuth();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const location = useLocation();
	const [signInError, setSignInError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);
			setError('');
			await login(emailRef.current.value, passwordRef.current.value);
			navigate('/profile');
		} catch {
			passwordRef.current.value = '';
			setError('Failed to sign in');
		}
		setLoading(false);
	};

	useEffect(() => {
		const loginReason = localStorage.getItem('loginReason');
		if (loginReason === 'requires-recent-login') {
			setSignInError('For security reasons, please sign in again.');
		}
		localStorage.removeItem('loginReason');
	}, [location]);

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
							Sign in
						</Typography>
						{signInError && (
							<Box mt={2} mb={1}>
								<Alert variant='outlined' severity='info'>
									{signInError}
								</Alert>
							</Box>
						)}
						<Box mt={1} sx={{ width: '100%' }}>
							<form onSubmit={handleSubmit}>
								{error && (
									<Box mb={1}>
										<Alert variant='outlined' severity='error'>
											<AlertTitle>An error occured:</AlertTitle>
											{error}
										</Alert>
									</Box>
								)}
								<TextField
									variant='outlined'
									margin='normal'
									required
									fullWidth
									id='email'
									label='Email Address'
									name='email'
									autoComplete='email'
									autoFocus
									inputRef={emailRef}
								/>
								<TextField
									variant='outlined'
									margin='normal'
									required
									fullWidth
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='current-password'
									inputRef={passwordRef}
								/>
								<Button
									type='submit'
									fullWidth
									variant='contained'
									color='primary'
									sx={{ mt: 1, mb: 2 }}
									disabled={loading}
								>
									Sign In
								</Button>
								<Grid container justifyContent='flex-end'>
									<Grid item xs display={'grid'} alignItems={'center'}>
										<Link underline='hover' component={RouterLink} to='/reset-password'>
											Forgot password?
										</Link>
									</Grid>
									<Grid item xs align='right'>
										<Link underline='hover' component={RouterLink} to='/register'>
											Don't have an account? Sign Up
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
