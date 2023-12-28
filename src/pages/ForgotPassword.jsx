import { useRef, useState } from 'react';
import {
	Button,
	Box,
	Container,
	CssBaseline,
	TextField,
	Link,
	Grid,
	Typography,
	Collapse,
	IconButton,
	Alert,
	AlertTitle,
	Paper,
	useMediaQuery,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '@mui/material/styles';

export default function ForgotPassword() {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const navigate = useNavigate();

	const emailRef = useRef();

	const { resetPassword } = useAuth();

	const [error, setError] = useState('');
	const [success, setSuccess] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setError('');
			setLoading(true);
			await resetPassword(emailRef.current.value);
			setSuccess(true);
			setTimeout(() => {
				navigate('/login');
			}, 10000);
		} catch {
			setError('Failed to reset password');
		}
		setLoading(false);
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
				<Paper elevation={3} sx={{ padding: theme.spacing(3), width: '100%', mt: 3, mb: 3 }}>
					<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<Typography component='h1' variant='h4'>
							Password Reset
						</Typography>
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
								{success && (
									<Box mb={1}>
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
												Check your inbox for further instructions.
											</Alert>
										</Collapse>
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
								<Button
									type='submit'
									fullWidth
									variant='contained'
									color='primary'
									sx={{ margin: theme.spacing(3, 0, 2) }}
									disabled={loading}
								>
									Reset Password
								</Button>
								<Grid container>
									<Grid item xs>
										<Link underline='hover' component={RouterLink} to='/login'>
											Sign In
										</Link>
									</Grid>
									<Grid item>
										<Link underline='hover' component={RouterLink} to='/register'>
											Don&apos;t have an account? Sign Up
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
