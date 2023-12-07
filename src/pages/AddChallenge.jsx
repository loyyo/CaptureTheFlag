import { useEffect, useRef, useState } from "react";
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
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AddChallenge() {
	const { addChallenge, getProfile, currentUserData, getAllChallengesData } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [fileName, setFileName] = useState("");

	const navigate = useNavigate();
	const challengeRef = useRef();
	const descriptionRef = useRef();
	const difficultyRef = useRef({ value: "easy" });
	const [correctAnswer, setCorrectAnswer] = useState("");
	const fileRef = useRef();
	const [file, setFile] = useState(null);

	useEffect(() => {
		setTimeout(() => {
			if (!currentUserData) {
				getProfile();
			}
		}, 100);
	}, []);

	const handleFileChange = () => {
		const selectedFile = fileRef.current?.files?.[0];
		if (selectedFile) {
			if (!selectedFile.type.startsWith("image/")) {
				setError("Invalid file type. Please select an image.");
				fileRef.current.value = null;
				setFile(null);
			} else {
				setError("");
				setFile(selectedFile);
				setFileName(selectedFile.name);
				setSuccess("");
			}
		}
	};

	const handleRemoveFile = () => {
		setFileName("");
		setFile(null);
		fileRef.current.value = null;
		setSuccessMessage("File removed successfully!");
	};

	const setSuccessMessage = (message) => {
		setSuccess(message);
		setTimeout(() => {
			setSuccess("");
		}, 3000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setError("");
			setSuccess("");
			setLoading(true);

			const challenge = challengeRef.current?.value;
			const description = descriptionRef.current?.value;
			const difficulty = difficultyRef.current.value || "easy";

			const redirectUrl = await addChallenge(
				currentUserData.userID,
				challenge,
				description,
				difficulty,
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

		setLoading(false);
	};

	return (
		<Container component="main" maxWidth="md">
			<Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<Typography component="h1" variant="h5">
					Add New Challenge
				</Typography>
				<Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
									onChange={(e) => (difficultyRef.current.value = e.target.value)}
								>
									<FormControlLabel value="easy" control={<Radio />} label="Easy" />
									<FormControlLabel value="medium" control={<Radio />} label="Medium" />
									<FormControlLabel value="hard" control={<Radio />} label="Hard" />
								</RadioGroup>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							{fileName ? (
								<Button
									variant="outlined"
									color="secondary"
									onClick={handleRemoveFile}
									sx={{ mt: 1 }}
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
							{fileName && (
								<Alert severity="success" sx={{ mt: 2 }}>
									Selected file: {fileName}
								</Alert>
							)}
						</Grid>
						<Grid item xs={12}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								color="primary"
								sx={{ mt: 3, mb: 2 }}
								disabled={loading}
							>
								Add Challenge
							</Button>
							{error && <Alert severity="error">{error}</Alert>}
							{success && <Alert severity="success">{success}</Alert>}
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
