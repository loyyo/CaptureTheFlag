import React, {useCallback} from "react";
import {useDropzone} from "react-dropzone";
import {Avatar, IconButton} from "@mui/material";
import {Delete as DeleteIcon} from "@mui/icons-material";

const Dropzone = ({ image, setImage, file, setFile }) => {
	const onDrop = useCallback((acceptedFiles) => {
		setImage(URL.createObjectURL(acceptedFiles[0]));
		setFile(acceptedFiles[0]);
	}, []);

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
				border: "2px dashed #ccc",
				padding: "20px",
				textAlign: "center",
				position: "relative",
			}}
		>
			<input {...getInputProps()} />
			{image ? (
				<div>
					<Avatar src={image} alt="Avatar" style={{ width: 200, height: 200 }} />
					<IconButton onClick={removeImage} style={{ position: "absolute", top: 0, right: 0 }}>
						<DeleteIcon />
					</IconButton>
				</div>
			) : (
				<p>
					Drag and drop an image here (or click) to update your avatar (resized to 200x200
					automatically)
				</p>
			)}
		</div>
	);
};

export default Dropzone;