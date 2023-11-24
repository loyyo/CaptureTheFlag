import {useEffect, useRef, useState} from 'react';
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
    Alert
} from '@mui/material';
import {useAuth} from '../../contexts/AuthContext.jsx';

export default function AddChallenge() {
    const {addChallenge, getProfile, currentUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const challengeRef = useRef();
    const descriptionRef = useRef();
    const difficultyRef = useRef({value: 'easy'});
    const [correctAnswer, setCorrectAnswer] = useState('');

    const fileRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (!currentUserData) {
                getProfile();
            }
        }, 100);
    }, []);

    const handleFileChange = () => {
        if (fileRef.current && fileRef.current?.files && fileRef.current.files.length > 0) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setSuccess(false);
            setLoading(true);

            const challenge = challengeRef.current?.value;
            const description = descriptionRef.current?.value;
            const difficulty = difficultyRef.current.value || 'easy';

            await addChallenge(currentUserData.userID, challenge, description, difficulty, correctAnswer, fileRef.current?.files?.[0]);
            setSuccess(true);

            challengeRef.current.value = '';
            descriptionRef.current.value = '';
            difficultyRef.current.value = 'easy';
            setCorrectAnswer('');
            fileRef.current.value = null;
        } catch (err) {
            setError('Failed to add challenge');
            console.error(err);
        }

        setLoading(false);
    };


    return (
        <Container component="main" maxWidth="md">
            <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography component="h1" variant="h5">
                    Add New Challenge
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
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Difficulty</FormLabel>
                                <RadioGroup
                                    row
                                    aria-label="difficulty"
                                    name="difficulty"
                                    defaultValue="easy"
                                    onChange={(e) => difficultyRef.current.value = e.target.value}
                                >
                                    <FormControlLabel value="easy" control={<Radio/>} label="Easy"/>
                                    <FormControlLabel value="medium" control={<Radio/>} label="Medium"/>
                                    <FormControlLabel value="hard" control={<Radio/>} label="Hard"/>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" component="label">
                                Upload File
                                <input
                                    type="file"
                                    hidden
                                    ref={fileRef}
                                    onChange={handleFileChange}
                                />
                            </Button>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{mt: 3, mb: 2}}
                        disabled={loading}
                    >
                        Add Challenge
                    </Button>
                    {error && <Alert severity="error">{error}</Alert>}
                    {success && <Alert severity="success">Challenge added successfully!</Alert>}
                </Box>
            </Box>
        </Container>
    );
}
