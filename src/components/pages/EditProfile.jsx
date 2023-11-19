import { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import { Alert, AlertTitle } from '@mui/lab';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Close as CloseIcon } from '@mui/icons-material';
import { DropzoneArea } from 'react-mui-dropzone';
import { useNavigate } from 'react-router-dom';

const PREFIX = 'EditProfile';

const classes = {
	paper: `${PREFIX}-paper`,
	avatar: `${PREFIX}-avatar`,
	form: `${PREFIX}-form`,
	submit: `${PREFIX}-submit`,
	loading: `${PREFIX}-loading`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},

	[`& .${classes.avatar}`]: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},

	[`& .${classes.form}`]: {
		width: '100%',
		marginTop: theme.spacing(3),
	},

	[`& .${classes.submit}`]: {
		margin: theme.spacing(3, 0, 2),
	},

	[`& .${classes.loading}`]: {
		width: '100%',
	},
}));

export default function EditProfile() {
	const navigate = useNavigate();

	const emailRef = useRef();
	const bioRef = useRef();
	const usernameRef = useRef();
	const passwordRef = useRef();
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
	} = useAuth();
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [file, setFile] = useState([]);

	const regex = '^[0-9A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż_-]{5,15}$';
	const bioregex = '^([\\x00-\\x7F]{1,300})$';
	const regexpw =
		// eslint-disable-next-line no-useless-escape
		'^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\dĄĆĘŁŃÓŚŹŻąćęłńóśźż~!@#$%^&*()[{};:|,.<>/?_=+\\]-]{6,}$';

	const handleChange = (e) => {
		setFile(e);
	};

	function handleSubmit(e) {
		e.preventDefault();
		if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
			return setError('Passwords do not match');
		}

		const promises = [];
		if (passwordRef.current.value) {
			promises.push(updatePassword(passwordRef.current.value));
		}
		if (emailRef.current.value !== currentUser.email) {
			promises.push(updateEmail(emailRef.current.value));
		}
		if (emailRef.current.value === currentUser.email) {
			if (
				usernameRef.current.value !== currentUserData.username &&
				usernameRef.current.value.length < 16
			) {
				usernameRef.current.value.slice(0, 15);
				promises.push(updateUsername(emailRef.current.value, usernameRef.current.value));
			}
			if (bioRef.current.value !== currentUserData.bio && bioRef.current.value.length < 301) {
				promises.push(updateBio(emailRef.current.value, bioRef.current.value));
			}
			if (file.length !== 0) {
				let transfer = file[0];
				promises.push(updateAvatar(emailRef.current.value, transfer));
			}
		}

		setLoading(true);
		setError('');
		Promise.all(promises)
			.then(() => {
				if (promises.length !== 0) {
					setSuccess(true);
					setTimeout(() => {
						navigate('/profile');
						navigate(0);
					}, 1000);
				} else {
					setError(`You haven't changed any values`);
				}
			})
			.catch((e) => {
				if (e instanceof TypeError || e instanceof RangeError || e instanceof EvalError) {
					setError('Failed to edit the account');
				}
			})
			.finally(() => {
				setLoading(false);
			});
	}

	useEffect(() => {
		if (!currentUserData) {
			getProfile();
		}
	});

	if (!currentUserData) {
		return (
			<StyledContainer component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</StyledContainer>
		);
	}

	return (
		<Container component='main' maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant='h4' className='header-text'>
							Settings
						</Typography>
					</Grid>
				</Grid>
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
									You have changed your profile.
								</Alert>
							</Collapse>
						</Box>
					)}
					<Grid container spacing={0}>
						<Grid item container spacing={2} md={6}>
							<Grid item md={11} xs={12}>
								<TextField
									variant='outlined'
									fullWidth
									id='username'
									label='Username'
									name='username'
									autoComplete='username'
									inputRef={usernameRef}
									defaultValue={currentUserData.username}
									inputProps={{
										pattern: regex,
										title: `Użyj od 5 do 15 znaków. Dozwolone znaki specjalne to '-' oraz '_'`,
									}}
								/>
							</Grid>
							<Grid item md={11} xs={12}>
								<TextField
									variant='outlined'
									fullWidth
									id='email'
									label='Email Address'
									name='email'
									autoComplete='email'
									inputRef={emailRef}
									defaultValue={currentUser.email}
								/>
							</Grid>
							<Grid item md={11} xs={12}>
								<TextField
									variant='outlined'
									fullWidth
									name='password'
									label='Password'
									type='password'
									id='password'
									autoComplete='current-password'
									inputRef={passwordRef}
									helperText='*Leave blank to keep the same'
									inputProps={{
										pattern: regexpw,
										title: 'Użyj minimum 6 znaków, przynajmniej jednej litery oraz jednej cyfry.',
									}}
								/>
							</Grid>
							<Grid item md={11} xs={12}>
								<TextField
									variant='outlined'
									fullWidth
									name='passwordConfirmation'
									label='Password Confirmation'
									type='password'
									id='passwordConfirmation'
									autoComplete='current-password'
									inputRef={passwordConfirmationRef}
									helperText='*Leave blank to keep the same'
								/>
							</Grid>
						</Grid>

						<Grid item container spacing={2} md={6}>
							<Grid item xs={12}>
								<TextField
									variant='outlined'
									fullWidth
									id='biography'
									label='Biography'
									name='biography'
									inputRef={bioRef}
									defaultValue={currentUserData.bio}
									inputProps={{ pattern: bioregex, title: 'Użyj maksymalnie 300 znaków' }}
								/>
							</Grid>
							<Grid item xs={12}>
								<DropzoneArea
									maxFileSize={5000000}
									filesLimit={1}
									onChange={handleChange}
									dropzoneText={
										'Drag and drop an image here (or click) to update your avatar (resized to 200x200 automatically)'
									}
									acceptedFiles={['image/jpeg', 'image/jpg', 'image/gif', 'image/png']}
									id='avatar'
									name='avatar'
								/>
							</Grid>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='primary'
						size='large'
						className={classes.submit}
						disabled={loading}
					>
						Save
					</Button>
					<Grid container justifyContent='center'>
						<Grid item>
							<Button
								onClick={() => {
									navigate('/profile');
								}}
								variant='outlined'
							>
								Cancel
							</Button>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
	);
}
