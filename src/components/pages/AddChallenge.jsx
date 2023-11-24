import {useEffect, useRef, useState} from 'react';
import {Container, TextField, Button, Grid, Box, Typography, Alert} from '@mui/material';
import {useAuth} from '../../contexts/AuthContext.jsx';

export default function AddChallenge() {
    const {addChallenge, getProfile, currentUserData} = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const challengeRef = useRef();
    const descriptionRef = useRef();
    const difficultyRef = useRef();

    const fileRef = useRef();

    useEffect(() => {
        setTimeout(() => {
            if (!currentUserData) {
                getProfile();
            }
        }, 100);
    }, []);

    const handleFileChange = (e) => {
        if (fileRef.current && fileRef.current.files && fileRef.current.files.length > 0) {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setError('');
            setSuccess(false);
            setLoading(true);

            const challenge = challengeRef.current.value;
            const description = descriptionRef.current.value;
            const difficulty = difficultyRef.current.value;

            await addChallenge(currentUserData.userID, challenge, description, difficulty, fileRef.current?.files?.[0]);
            setSuccess(true);

            challengeRef.current.value = '';
            descriptionRef.current.value = '';
            difficultyRef.current.value = '';
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
                                id="difficulty"
                                label="Difficulty"
                                name="difficulty"
                                inputRef={difficultyRef}
                            />
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
