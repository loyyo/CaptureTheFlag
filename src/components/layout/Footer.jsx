import { Link, Box, Typography } from '@mui/material';

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
