import React, {useEffect, useRef, useState} from 'react';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Container,
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    Alert,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, CssBaseline
} from '@mui/material';
import {useAuth} from '../contexts/AuthContext.jsx';
import {useParams, useNavigate} from 'react-router-dom';

export default function EditChallenge() {
    const {
        getSingleChallengeData,
        updateChallenge,
        deleteChallenge,
        singleChallengeData,
        getProfile,
        currentUserData
    } = useAuth();
    const {challengeURL} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const challengeRef = useRef();
    const descriptionRef = useRef();
    const [difficulty, setDifficulty] = useState('easy');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const fileRef = useRef(null);

    useEffect(() => {
        if (!currentUserData) {
            getProfile();
        }
    }, [currentUserData, getProfile]);

    useEffect(() => {
        if (currentUserData) {
            getSingleChallengeData(challengeURL);
        }
    }, [currentUserData, challengeURL, getSingleChallengeData]);

    useEffect(() => {
        setLoaded(true);
        if (singleChallengeData.length > 0 && singleChallengeData[0].url === challengeURL) {
            const challengeData = singleChallengeData[0];

            if (currentUserData.userID !== challengeData.userID) {
                navigate('/challenges');
                return;
            }

            if (challengeRef.current) {
                challengeRef.current.value = challengeData.title;
            }
            if (descriptionRef.current) {
                descriptionRef.current.value = challengeData.description;
            }
            setDifficulty(challengeData.difficulty);
            setCorrectAnswer(challengeData.key);
            setFileName(challengeData.fileName || '');
        }
    }, [singleChallengeData, challengeURL]);

    const handleFileChange = () => {
        const selectedFile = fileRef.current?.files?.[0];

        if (selectedFile) {
            if (!selectedFile.type.startsWith('image/')) {
                setError('Invalid file type. Please select an image.');
                fileRef.current.value = null;
                setFile(null);
                setFileName('');
            } else {
                setError('');
                setFile(selectedFile);
                setFileName(selectedFile.name);
            }
        }
    };

    const handleRemoveFile = () => {
        setFileName('');
        setFile('remove');
    };

    const setSuccessMessage = (message) => {
        setSuccess(message);
        setTimeout(() => {
            setSuccess('');
        }, 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setSuccess('');
            setLoading(true);

            const title = challengeRef.current.value;
            const description = descriptionRef.current.value;

            await updateChallenge(challengeURL, {
                title,
                description,
                difficulty,
                correctAnswer,
                image: file
            });
            window.location.href = `/challenges/${challengeURL}`;
        } catch (err) {
            setError('Failed to update challenge');
            console.error(err);
        }

        setLoading(false);
    };

    const handleDelete = () => {
        setIsModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            setLoading(true);
            await deleteChallenge(challengeURL);
            window.location.href = '/';
        } catch (err) {
            console.error(err);
            setError('Failed to delete challenge');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
        }
    };

    if (!loaded) {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 'calc(100vh - 90px)' // Header height
                }}>
                    <Box m={10}>
                        <LinearProgress />
                    </Box>
                </Box>
            </Container>
        );
    } else {
        return (
            <Container component="main" maxWidth="md">
                <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                    <Typography component="h1" variant="h5">
                        Edit Challenge
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 3}}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="challenge"
                                    label="Challenge Name"
                                    name="challenge"
                                    inputRef={challengeRef}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    inputRef={descriptionRef}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="correctAnswer"
                                    label="Correct Answer"
                                    name="correctAnswer"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Difficulty</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-label="difficulty"
                                        name="difficulty"
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                    >
                                        <FormControlLabel value="easy" control={<Radio/>} label="Easy"/>
                                        <FormControlLabel value="medium" control={<Radio/>} label="Medium"/>
                                        <FormControlLabel value="hard" control={<Radio/>} label="Hard"/>
                                    </RadioGroup>

                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                {fileName ? (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleRemoveFile}
                                        sx={{mt: 1}}
                                    >
                                        Remove File
                                    </Button>
                                ) : (
                                    <Button variant="contained" component="label">
                                        Upload File
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            ref={fileRef}
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                )}
                                {fileName && <Alert severity="success" sx={{mt: 2}}>Selected file: {fileName}</Alert>}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2} justifyContent="flex-start">
                                    <Grid item>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            sx={{mb: 2}}
                                            disabled={loading}
                                        >
                                            SAVE
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleDelete}
                                            disabled={loading}
                                            sx={{mb: 2}}
                                        >
                                            DELETE
                                        </Button>
                                    </Grid>
                                </Grid>
                                {error && <Alert severity="error">{error}</Alert>}
                                {success && <Alert severity="success">{success}</Alert>}
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Dialog
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this challenge? This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsModalOpen(false)} color="secondary">No</Button>
                        <Button onClick={handleDeleteConfirm} autoFocus color="secondary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        );
    }
}