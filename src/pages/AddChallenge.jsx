import { useEffect, useRef, useState } from 'react';
import {
	Container,
	CssBaseline,
	LinearProgress,
	TextField,
	Button,
	Grid,
	Box,
	Typography,
	Alert,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Paper,
	useMediaQuery,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Dropzone from '../components/Dropzone';
import { useTheme } from '@mui/material/styles';

export default function AddChallenge() {
	const {
		addChallenge,
		getProfile,
		currentUserData,
		getAllChallengesData,
		checkForDuplicateChallenge,
	} = useAuth();
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const navigate = useNavigate();
	const challengeRef = useRef();
	const descriptionRef = useRef();
	const [correctAnswer, setCorrectAnswer] = useState('');
	const [image, setImage] = useState(null);
	const [file, setFile] = useState();
	const [difficulty, setDifficulty] = useState('easy');
	const [isTitleValid, setIsTitleValid] = useState(true);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	useEffect(() => {
		setTimeout(() => {
			if (!currentUserData) {
				getProfile();
			}
		}, 100);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const validateTitle = (title) => {
		const regex = /^[a-zA-Z0-9 _-]+$/;
		return regex.test(title);
	};

	const handleChangeTitle = (e) => {
		const title = e.target.value;
		if (!validateTitle(title)) {
			setError('Title contains invalid characters.');
			setIsTitleValid(false);
		} else {
			setError('');
			setIsTitleValid(true);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const challenge = challengeRef.current?.value;
		const isDuplicate = await checkForDuplicateChallenge(challenge);

		if (isDuplicate) {
			setError('A challenge with this name already exists.');
			return;
		}

		try {
			setError('');
			setSuccess('');

			const description = descriptionRef.current?.value;
			const difficultyValue = difficulty || 'easy';

			const redirectUrl = await addChallenge(
				currentUserData.userID,
				challenge,
				description,
				difficultyValue,
				correctAnswer,
				file
			);
			navigate(`/challenges/${redirectUrl}`);
		} catch (err) {
			setError('Failed to add challenge');
			console.error(err);
		} finally {
			getAllChallengesData();
		}
	};

	const handleCancel = () => {
		navigate('/challenges');
	};

	if (!currentUserData) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box
					sx={{
						mt: 2,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						height: 'calc(100vh - 90px)', // Header height
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
		<Container component='main' maxWidth='md' sx={{ mb: isMobile ? 8 : 2 }}>
			<Box
				mt={isMobile ? 1 : 2}
				sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
			>
				<Paper
					elevation={0}
					sx={{
						padding: 2,
						borderRadius: '4px',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<Box component='form' onSubmit={handleSubmit} mt={1}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Typography variant='h4' align='center'>
									Add New Challenge
								</Typography>
							</Grid>
							<Grid item xs={12}>
								<TextField
									required
									fullWidth
									id='challenge'
									label='Challenge Name'
									name='challenge'
									onChange={handleChangeTitle}
									inputRef={challengeRef}
									inputProps={{
										maxLength: 25,
									}}
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

							<Grid item xs={12} sm={7} order={isMobile ? 2 : 1}>
								<TextField
									required
									fullWidth
									id='description'
									label='Description'
									name='description'
									multiline
									rows={image !== null ? 10 : 4}
									inputRef={descriptionRef}
									inputProps={{
										maxLength: 300,
									}}
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

							<Grid item xs={12} sm={7} order={isMobile ? 3 : 4}>
								<TextField
									required
									fullWidth
									id='correctAnswer'
									label='Correct Answer'
									name='correctAnswer'
									value={correctAnswer}
									onChange={(e) => setCorrectAnswer(e.target.value)}
									inputProps={{
										maxLength: 50,
									}}
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

							<Grid item xs={12} sm={5} order={isMobile ? 4 : 3}>
								<FormControl fullWidth>
									<InputLabel id='difficulty-select-label'>Difficulty</InputLabel>
									<Select
										labelId='difficulty-select-label'
										id='difficulty-select'
										value={difficulty}
										label='Difficulty'
										onChange={(e) => setDifficulty(e.target.value)}
										sx={{
											'& .MuiOutlinedInput-notchedOutline': {
												borderColor: '#252028',
												borderWidth: '2px',
											},
											'&:hover .MuiOutlinedInput-notchedOutline': {
												borderColor: '#252028',
												borderWidth: '3px',
											},
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
												borderColor: '#252028',
												borderWidth: '2px',
											},
											'& .MuiSelect-select': {
												backgroundColor: 'transparent',
											},
										}}
									>
										<MenuItem value='easy'>Easy</MenuItem>
										<MenuItem value='medium'>Medium</MenuItem>
										<MenuItem value='hard'>Hard</MenuItem>
									</Select>
								</FormControl>
							</Grid>

							<Grid item xs={12} sm={5} order={isMobile ? 5 : 2}>
								<Box
									sx={{
										minHeight: '100%',
										minWidth: '100%',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Dropzone image={image} setImage={setImage} file={file} setFile={setFile} />
								</Box>
							</Grid>

							<Grid item xs={12} order={isMobile ? 6 : 5}>
								<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 1 }}>
									<Button
										variant='outlined'
										color='secondary'
										sx={{ mr: 2 }}
										onClick={handleCancel}
									>
										Cancel
									</Button>
									<Button
										type='submit'
										variant='contained'
										color='primary'
										disabled={!isTitleValid}
										sx={{ padding: '10px 20px' }}
									>
										Add Challenge
									</Button>
								</Box>
								{error && <Alert severity='error'>{error}</Alert>}
								{success && <Alert severity='success'>{success}</Alert>}
							</Grid>
						</Grid>
					</Box>
				</Paper>
			</Box>
		</Container>
	);
}
