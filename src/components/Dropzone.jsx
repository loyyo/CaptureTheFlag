import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import PropTypes from "prop-types";
import {useTheme} from "@mui/material/styles";

const Dropzone = ({ image, setImage, setFile }) => {
	const theme = useTheme();

	const onDrop = useCallback((acceptedFiles) => {
		setImage(URL.createObjectURL(acceptedFiles[0]));
		setFile(acceptedFiles[0]);
	}, [setImage, setFile]);

	const { getRootProps, getInputProps } = useDropzone({
		accept: "image/jpeg, image/jpg, image/gif, image/png",
		maxFiles: 1,
		maxSize: 5000000,
		onDrop,
	});

	const removeImage = (event) => {
		event.stopPropagation();
		setImage(null);
		setFile(null);
	};

	return (
		<div
			{...getRootProps()}
			style={{
				border: "2px dashed #252028",
				backgroundColor: theme.palette.mode === 'dark' ? '#252028' : '',
				padding: "20px",
				textAlign: "center",
				position: "relative",
			}}
		>
			<input {...getInputProps()} />
			{image ? (
				<div>
					<img src={image} alt="Preview" style={{ width: 200, height: 200, objectFit: 'cover' }} />
					<IconButton onClick={removeImage} style={{ position: "absolute", top: 0, right: 0 }}>
						<DeleteIcon />
					</IconButton>
				</div>
			) : (
				<p>
					Drag and drop an image here (or click) to update your photo (resized to 200x200 automatically)
				</p>
			)}
		</div>
	);
};

Dropzone.propTypes = {
	image: PropTypes.string,
	setImage: PropTypes.func.isRequired,
	setFile: PropTypes.func,
};

export default Dropzone;
