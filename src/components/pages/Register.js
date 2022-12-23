import React, { useRef, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Alert, AlertTitle } from '@material-ui/lab';
import { useAuth } from '../../contexts/AuthContext';
import Box from '@material-ui/core/Box';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignUp() {
	const classes = useStyles();
	const navigate = useNavigate();

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
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign up
				</Typography>
				<form onSubmit={handleSubmit} className={classes.form}>
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
						className={classes.submit}
						disabled={loading}
					>
						Sign Up
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Link to='/login'>Already have an account? Sign in</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
