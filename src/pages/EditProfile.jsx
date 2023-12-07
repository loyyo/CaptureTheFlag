import React, { useRef, useCallback, useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
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
	Avatar,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Dropzone from '../components/Dropzone';

export default function EditProfile() {
	const navigate = useNavigate();
	const theme = useTheme();

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
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [file, setFile] = useState([]);
	const [image, setImage] = useState();

	function handleSubmit(e) {
		e.preventDefault();

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
			if (file) {
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
				<CssBaseline />
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						height: "calc(100vh - 90px)",
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
		<Container component="main" maxWidth="lg">
			<CssBaseline />
			<Box
				mt={5}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Grid container>
					<Grid item xs={12}>
						<Typography variant="h4" className="header-text">
							Settings
						</Typography>
					</Grid>
				</Grid>
				<Box mt={3} sx={{ width: "100%" }}>
					<form onSubmit={handleSubmit}>
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
												<CloseIcon fontSize="inherit" />
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
										variant="outlined"
										fullWidth
										id="username"
										label="Username"
										name="username"
										autoComplete="username"
										inputRef={usernameRef}
										defaultValue={currentUserData.username}
									/>
								</Grid>
								<Grid item md={11} xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="email"
										label="Email Address"
										name="email"
										autoComplete="email"
										inputRef={emailRef}
										defaultValue={currentUser.email}
									/>
								</Grid>
								<Grid item md={11} xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										name="password"
										label="Password"
										type="password"
										id="password"
										autoComplete="current-password"
										inputRef={passwordRef}
										helperText="*Leave blank to keep the same"
									/>
								</Grid>
								<Grid item md={11} xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										name="passwordConfirmation"
										label="Password Confirmation"
										type="password"
										id="passwordConfirmation"
										autoComplete="current-password"
										inputRef={passwordConfirmationRef}
										helperText="*Leave blank to keep the same"
									/>
								</Grid>
							</Grid>

							<Grid item container spacing={2} md={6}>
								<Grid item xs={12}>
									<TextField
										variant="outlined"
										fullWidth
										id="biography"
										label="Biography"
										name="biography"
										inputRef={bioRef}
										defaultValue={currentUserData.bio}
									/>
								</Grid>
								<Grid item xs={12}>
									{currentUserData && <Dropzone
										image={image}
										setImage={setImage}
										file={file}
										setFile={setFile}
									/>
									}
								</Grid>
							</Grid>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							size="large"
							sx={{ margin: theme.spacing(3, 0, 2) }}
							disabled={loading}
						>
							Save
						</Button>
						<Grid container justifyContent="center">
							<Grid item>
								<Button
									onClick={() => {
										navigate("/profile");
									}}
									variant="outlined"
								>
									Cancel
								</Button>
							</Grid>
						</Grid>
					</form>
				</Box>
			</Box>
		</Container>
	);
}
