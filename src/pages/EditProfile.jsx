import {useRef, useState, useEffect} from "react";
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
    Alert,
    AlertTitle,
    Divider,
    Paper
} from "@mui/material";
import {useAuth} from "../contexts/AuthContext.jsx";
import {Close as CloseIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import Dropzone from '../components/Dropzone';

export default function EditProfile() {
    const navigate = useNavigate();

    const emailRef = useRef();
    const bioRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const currentPasswordRef = useRef();
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
        currentPassword
    } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [file, setFile] = useState([]);
    const [image, setImage] = useState();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!currentPasswordRef.current.value) {
            setError("Please enter your current password");
            return;
        }

        if (usernameRef.current.value.length < 5 || usernameRef.current.value.length > 15) {
            setError("Username must be between 5 and 15 characters");
            return;
        }

        if (!emailRef.current.value.includes("@") || !emailRef.current.value.endsWith(".com")) {
            setError("Email address is not valid");
            return;
        }

        if (passwordRef.current.value && passwordRef.current.value.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (passwordRef.current.value !== passwordConfirmationRef.current.value) {
            setError("Passwords do not match");
            return;
        }

        if (bioRef.current.value.length > 300) {
            setError("Biography must be less than 300 characters");
            return;
        }

        if (currentPasswordRef.current.value) {
            const isPasswordCorrect = await currentPassword(currentPasswordRef.current.value);
            if (!isPasswordCorrect) {
                setError("Current password is incorrect");
                return;
            }
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
                usernameRef.current.value = usernameRef.current.value.slice(0, 15);
                promises.push(updateUsername(emailRef.current.value, usernameRef.current.value));
            }
            if (bioRef.current.value !== currentUserData.bio && bioRef.current.value.length < 301) {
                promises.push(updateBio(emailRef.current.value, bioRef.current.value));
            }
            if (file && file.path) {
                promises.push(updateAvatar(emailRef.current.value, file));
            }
        }

        setLoading(true);
        setError("");
        Promise.all(promises)
            .then(() => {
                if (promises.length !== 0) {
                    setSuccess(true);
                    setTimeout(() => {
                        navigate("/profile");
                        navigate(0);
                    }, 1000);
                } else {
                    setError(`You haven't changed any values`);
                }
            })
            .catch((e) => {
                if (e instanceof TypeError || e instanceof RangeError || e instanceof EvalError) {
                    setError("Failed to edit the account");
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleCancel = () => {
        navigate("/profile");
    };

    useEffect(() => {
        if (!currentUserData) {
            getProfile();
        }
    });

    useEffect(() => {
        if (currentUserData && currentUserData.avatar) {
            setImage(currentUserData.avatar);
        }
    }, [currentUserData]);

    if (!currentUserData) {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "calc(100vh - 90px)",
                    }}
                >
                    <Box m={10}>
                        <LinearProgress/>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="lg">
            <CssBaseline/>
            <Box
                mt={5}
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper elevation={7} sx={{
                    padding: 2,
                    borderRadius: '4px',
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}>
                    <Typography variant="h4" gutterBottom>
                        Edit Profile
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} sx={{width: "100%", mt: 3}}>
                        {error && (
                            <Box mt={-1} mb={2}>
                                <Alert variant="outlined" severity="error">
                                    <AlertTitle>An error occured:</AlertTitle>
                                    {error}
                                </Alert>
                            </Box>
                        )}
                        {success && (
                            <Box mt={-1} mb={2}>
                                <Collapse in={success}>
                                    <Alert
                                        variant="outlined"
                                        severity="success"
                                        action={
                                            <IconButton
                                                aria-label="close"
                                                color="inherit"
                                                size="small"
                                                onClick={() => {
                                                    setSuccess(false);
                                                }}
                                            >
                                                <CloseIcon fontSize="inherit"/>
                                            </IconButton>
                                        }
                                    >
                                        <AlertTitle>Success!</AlertTitle>
                                        You have changed your profile.
                                    </Alert>
                                </Collapse>
                            </Box>
                        )}
                        <Grid container spacing={3} alignItems="stretch">
                            {/* Left Column */}
                            {/* Left Column */}
                            <Grid item xs={12} md={5}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    inputRef={usernameRef}
                                    defaultValue={currentUserData.username}
                                    sx={{mb: 2}}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    inputRef={emailRef}
                                    defaultValue={currentUser.email}
                                    sx={{mb: 2}}
                                />
                                <Dropzone
                                    image={image}
                                    setImage={setImage}
                                    file={file}
                                    setFile={setFile}
                                />
                            </Grid>

                            {/* Vertical Divider */}
                            <Grid item xs={12} md={1}
                                  sx={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                                <Divider orientation="vertical" sx={{height: "100%"}}/>
                            </Grid>

                            {/* Right Column */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="currentPassword"
                                    label="Current Password"
                                    type="password"
                                    id="currentPassword"
                                    autoComplete="current-password"
                                    inputRef={currentPasswordRef}
                                    required
                                    sx={{mb: 2}}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="password"
                                    label="New Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    inputRef={passwordRef}
                                    sx={{mb: 2}}
                                />
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    name="passwordConfirmation"
                                    label="Confirm New Password"
                                    type="password"
                                    id="passwordConfirmation"
                                    autoComplete="new-password"
                                    inputRef={passwordConfirmationRef}
                                />
                            </Grid>

                            {/* Biography */}
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    id="biography"
                                    label="Biography"
                                    name="biography"
                                    multiline
                                    rows={4}
                                    inputRef={bioRef}
                                    defaultValue={currentUserData.bio}
                                />
                            </Grid>
                        </Grid>

                        {/* Buttons */}
                        <Box sx={{width: '100%', mt: 3, display: 'flex', justifyContent: 'center'}}>
                            <Button onClick={handleCancel} variant="outlined" sx={{mr: 2}}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                                Save Changes
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
