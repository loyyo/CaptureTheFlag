import { Grid, Box, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const PREFIX = 'ChatMessage';

const classes = {
	avatar: `${PREFIX}-avatar`,
};

const StyledBox = styled(Box)(() => ({
	[`& .${classes.avatar}`]: {
		width: '40px',
		height: '40px',
		margin: '2px 5px',
	},
}));

export default function ChatMessage({ message, currentUserData, allUsersData }) {
	const messageClass = currentUserData.userID === message.userID ? 'sent' : 'received';

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
		<StyledBox p={1}>
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
								className={classes.avatar}
								style={{ padding: '0.25rem' }}
								// imgProps={{ title: `${username()}` }}
							/>
							<Typography className='message'>{message.text}</Typography>
						</Grid>
					</Grid>
				)}
				{messageClass === 'sent' && <Typography className='message'>{message.text}</Typography>}
			</Box>
		</StyledBox>
	);
}

ChatMessage.propTypes = {
	message: PropTypes.object.isRequired,
	allUsersData: PropTypes.array.isRequired,
	currentUserData: PropTypes.object.isRequired,
};
