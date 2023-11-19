import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	TextField,
	Grid,
	CssBaseline,
	Button,
	Avatar,
	Collapse,
	Container,
	Typography,
	IconButton,
	Box,
	FormControl,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined as LockOutlinedIcon, Close as CloseIcon } from '@mui/icons-material';
import { Alert, AlertTitle } from '@mui/lab';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function SignUp() {
	const navigate = useNavigate();
	const theme = useTheme();

	const usernameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();
	const passwordConfirmationRef = useRef();

	const { signup } = useAuth();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const regex = '^[0-9A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż_-]{5,15}$';
	const regexpw =
		// eslint-disable-next-line no-useless-escape
		'^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\dĄĆĘŁŃÓŚŹŻąćęłńóśźż~!@#$%^&*()[{};:|,.<>/?_=+\\]-]{6,}$';

	async function handleSubmit(e) {
		e.preventDefault();

		if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
			passwordRef.current.value = '';
			passwordConfirmationRef.current.value = '';
			return setError('Passwords do not match');
		}

		try {
			setError('');
			setLoading(true);
			usernameRef.current.value.slice(0, 15);
			await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value);
			setSuccess(true);
			navigate('/profile');
		} catch {
			passwordRef.current.value = '';
			passwordConfirmationRef.current.value = '';
			setError('Failed to create an account');
		}
		setLoading(false);
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Box mt={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Avatar sx={{ margin: theme.spacing(1), backgroundColor: theme.palette.primary.main }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<FormControl onSubmit={handleSubmit} sx={{ width: '100%', marginTop: theme.spacing(3) }}>
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
								inputProps={{
									pattern: regex,
									title: `Użyj od 5 do 15 znaków. Dozwolone znaki specjalne to '-' oraz '_'`,
								}}
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
								inputProps={{
									pattern: regexpw,
									title: 'Użyj minimum 6 znaków, przynajmniej jednej litery oraz jednej cyfry.',
								}}
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
						sx={{ margin: theme.spacing(3, 0, 2) }}
						disabled={loading}
					>
						Sign Up
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Link to='/login'>Already have an account? Sign in</Link>
						</Grid>
					</Grid>
				</FormControl>
			</Box>
		</Container>
	);
}
