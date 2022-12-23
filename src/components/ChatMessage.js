import React from 'react';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	avatar: {
		width: '40px',
		height: '40px',
		margin: '2px 5px',
	},
}));

export default function ChatMessage({ message, currentUserData, allUsersData }) {
	const classes = useStyles();

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
		<>
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
			</Box>
		</>
	);
}
