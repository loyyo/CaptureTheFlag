import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
	TextField,
	CssBaseline,
	Button,
	Avatar,
	Grid,
	Typography,
	Container,
	Box,
	Link,
	Alert,
	AlertTitle,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function SignIn() {
	const navigate = useNavigate();
	const theme = useTheme();

	const emailRef = useRef();
	const passwordRef = useRef();

	const { login } = useAuth();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

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

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Box mt={8} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Avatar sx={{ margin: theme.spacing(1), backgroundColor: theme.palette.primary.main }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign in
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
							sx={{ margin: theme.spacing(3, 0, 2) }}
							disabled={loading}
						>
							Sign In
						</Button>
						<Grid container justifyContent='flex-end'>
							<Grid item xs>
								<Link underline='hover' component={RouterLink} to='/reset-password'>
									Forgot password?
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
		</Container>
	);
}
