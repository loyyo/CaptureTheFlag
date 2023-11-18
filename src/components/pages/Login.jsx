import { useRef, useState } from 'react';
import {
	TextField,
	CssBaseline,
	Button,
	Avatar,
	Grid,
	Typography,
	Container,
	Box,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import { Alert, AlertTitle } from '@mui/lab';
import { useAuth } from '../../contexts/AuthContext.jsx';

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
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const classes = useStyles();
	const navigate = useNavigate();

	const emailRef = useRef();
	const passwordRef = useRef();

	const { login } = useAuth();

	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
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
	}

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component='h1' variant='h5'>
					Sign in
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
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
						className={classes.submit}
						disabled={loading}
					>
						Sign In
					</Button>
					<Grid container justifyContent='flex-end'>
						<Grid item>
							<Link to='/register'>{"Don't have an account? Sign Up"}</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
