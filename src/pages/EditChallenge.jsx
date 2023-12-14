import {useEffect, useRef, useState} from 'react';
import {
    FormControl,
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
    DialogTitle,
    CssBaseline,
    InputLabel,
    Select,
    MenuItem,
    Paper
} from '@mui/material';
import {useAuth} from '../contexts/AuthContext.jsx';
import {useParams, useNavigate} from 'react-router-dom';
import Dropzone from '../components/Dropzone';

export default function EditChallenge() {
    const {
        getSingleChallengeData,
        updateChallenge,
        deleteChallenge,
        singleChallengeData,
        getProfile,
        currentUserData,
        getAllChallengesData
    } = useAuth();
    const {challengeURL} = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const challengeRef = useRef();
    const descriptionRef = useRef();
    const [difficulty, setDifficulty] = useState('easy');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [image, setImage] = useState();
    const [file, setFile] = useState(null);

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
            setImage(challengeData.image);
            setFile(challengeData.image);
        }
    }, [singleChallengeData, challengeURL, currentUserData, navigate]);

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
            navigate(`/challenges/${challengeURL}`);
        } catch (err) {
            setError('Failed to update challenge');
            console.error(err);
        } finally {
            getAllChallengesData();
            getSingleChallengeData(challengeURL);
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
            navigate(`/`);
        } catch (err) {
            console.error(err);
            setError('Failed to delete challenge');
        } finally {
            setLoading(false);
            setIsModalOpen(false);
            getAllChallengesData();
        }
    };

    if (!loaded) {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 'calc(100vh - 90px)' // Header height
                }}>
                    <Box m={10}>
                        <LinearProgress/>
                    </Box>
                </Box>
            </Container>
        );
    } else {
        return (
            <Container component="main" maxWidth="md">
                <Box sx={{mt: 8, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Paper elevation={7} sx={{
                        padding: 2,
                        borderRadius: '4px',
                        mt: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <Typography component="h1" variant="h5">Edit Challenge</Typography>
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

                                <Grid item xs={7}>
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
                                <Grid item xs={5}>
                                    <Box sx={{minHeight: '100%', display: 'flex', alignItems: 'center'}}>
                                        <Dropzone image={image} setImage={setImage} file={file} setFile={setFile}/>
                                    </Box>
                                </Grid>

                                <Grid item xs={5}>
                                    <FormControl fullWidth>
                                        <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
                                        <Select
                                            labelId="difficulty-select-label"
                                            id="difficulty-select"
                                            value={difficulty}
                                            label="Difficulty"
                                            onChange={(e) => setDifficulty(e.target.value)}
                                        >
                                            <MenuItem value="easy">Easy</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="hard">Hard</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={7}>
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
                                    <Grid container spacing={2} justifyContent="center">
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                onClick={handleDelete}
                                                disabled={loading}
                                                sx={{mb: 2, width: 100}}
                                            >
                                                DELETE
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                sx={{mb: 2, width: 200}}
                                                disabled={loading}
                                            >
                                                SAVE
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {error && <Alert severity="error">{error}</Alert>}
                                    {success && <Alert severity="success">{success}</Alert>}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
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
