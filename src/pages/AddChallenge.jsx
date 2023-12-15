import {useEffect, useRef, useState} from "react";
import {
    Container,
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
    Paper
} from "@mui/material";
import {useAuth} from "../contexts/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import Dropzone from '../components/Dropzone';

export default function AddChallenge() {
    const {addChallenge, getProfile, currentUserData, getAllChallengesData} = useAuth();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const challengeRef = useRef();
    const descriptionRef = useRef();
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [image, setImage] = useState();
    const [file, setFile] = useState();
    const [difficulty, setDifficulty] = useState("easy");

    useEffect(() => {
        setTimeout(() => {
            if (!currentUserData) {
                getProfile();
            }
        }, 100);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError("");
            setSuccess("");

            const challenge = challengeRef.current?.value;
            const description = descriptionRef.current?.value;
            const difficultyValue = difficulty || "easy";

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
            setError("Failed to add challenge");
            console.error(err);
        } finally {
            getAllChallengesData();
        }
    };

    const handleCancel = () => {
        navigate('/challenges');
    };

    return (
        <Container component="main" maxWidth="md">
            <Box sx={{mt: 8, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Paper elevation={7} sx={{
                    padding: 2,
                    borderRadius: '4px',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Typography component="h1" variant="h5">Add New Challenge</Typography>
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
                                />
                            </Grid>

                            <Grid item xs={12} sm={7}>
                                <TextField
                                    required
                                    fullWidth
                                    id="description"
                                    label="Description"
                                    name="description"
                                    multiline
                                    rows={4}
                                    inputRef={descriptionRef}
                                />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                                <Box sx={{minHeight: '100%', display: 'flex', alignItems: 'center'}}>
                                    <Dropzone image={image} setImage={setImage} file={file} setFile={setFile}/>
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={5}>
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
                            <Grid item xs={12} sm={7}>
                                <TextField
                                    required
                                    fullWidth
                                    id="correctAnswer"
                                    label="Correct Answer"
                                    name="correctAnswer"
                                    value={correctAnswer}
                                    onChange={(e) => setCorrectAnswer(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{display: 'flex', justifyContent: 'center', mt: 3, mb: 2}}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        sx={{mr: 2}}
                                        onClick={handleCancel}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Add Challenge
                                    </Button>
                                </Box>
                                {error && <Alert severity="error">{error}</Alert>}
                                {success && <Alert severity="success">{success}</Alert>}
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
