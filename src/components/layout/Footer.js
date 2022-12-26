import React from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

const Footer = () => {
	return (
		<Box mt={3}>
			<Typography variant='body2' color='textSecondary' align='center'>
				{'Copyright © '}
				<Link color='inherit' href='https://github.com/loyyo/CaptureTheFlag'>
					Capture The Flag
				</Link>{' '}
				{new Date().getFullYear()}
				{'.'}
			</Typography>
		</Box>
	);
};

export default Footer;
