import { Grid, Box, Typography, Avatar } from '@mui/material';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';

export default function ChatMessage({ message, currentUserData, allUsersData }) {
	const messageClass = currentUserData.userID === message.userID ? 'sent' : 'received';
	const theme = useTheme();
	const avatarSrc = () => {
		let link = '';
		allUsersData.forEach((e) => {
			if (e.userID === message.userID) {
				link = e.avatar;
			}
		});
		return link;
	};
	const username = () => {
		let link = '';
		allUsersData.forEach((e) => {
			if (e.userID === message.userID) {
				link = e.username;
			}
		});
		return link;
	};

	return (
		<Box p={1}>
			<Box className={`messages ${messageClass}`}>
				{messageClass === 'received' && (
					<Grid container direction='column'>
						<Grid item xs={12}>
							<Typography variant='caption'>{username()}</Typography>
						</Grid>
						<Grid container item xs={12}>
							<Avatar
								alt='chat_avatar'
								src={avatarSrc()}
								sx={{ width: '40px', height: '40px', margin: '2px 5px', padding: '0.25rem' }}
								// imgProps={{ title: `${username()}` }}
							/>
							<Typography className='message'>{message.text}</Typography>
						</Grid>
					</Grid>
				)}
				{messageClass === 'sent' && (
					<Typography
						className='message'
						sx={{
							backgroundColor: theme.palette.mode === 'dark' ? '#40376F' : '#A3A7E4',
							color: theme.palette.mode === 'dark' ? 'white' : 'white',
						}}
					>
						{message.text}
					</Typography>
				)}
			</Box>
		</Box>
	);
}

ChatMessage.propTypes = {
	message: PropTypes.object.isRequired,
	allUsersData: PropTypes.array.isRequired,
	currentUserData: PropTypes.object.isRequired,
};
