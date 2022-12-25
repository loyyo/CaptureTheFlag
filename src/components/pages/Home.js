import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	button: {
		margin: theme.spacing(2.5, 0, 2.5),
	},
	darkModeButton: {
		margin: theme.spacing(2.5, 0, 2.5),
		backgroundColor: theme.palette.primary.light,
		color: 'white',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
}));

export default function Home() {
	const classes = useStyles();
	const navigate = useNavigate();

	return (
		<Container maxWidth='md'>
			<CssBaseline />
			<Grid container spacing={5}>
				<Grid item xs={12}>
					<div className={classes.paper}>
						<Paper variant='outlined' elevation={3}>
							<Box m={3}>
								<Typography variant='h4' className='leaderboard-header'>
									Welcome to Capture The Flag!
								</Typography>
								<Typography variant='h5' className='description'>
									CaptureTheFlag is a platform that enables people to learn, practice, and compete
									in the field of geography, specifically world's flags.
								</Typography>
								<Typography variant='h5' className='leaderboard-header-dark'>
									JOIN AND CATCH'EM ALL!
								</Typography>
							</Box>
							<Divider variant='middle' />
							<Grid justifyContent='center' container spacing={3}>
								<Grid item>
									<Button
										type='button'
										fullWidth
										variant='contained'
										color='primary'
										size='large'
										className={classes.button}
										onClick={() => {
											navigate('/register');
										}}
									>
										SIGN UP
									</Button>
								</Grid>
								<Grid item>
									<Button
										type='button'
										fullWidth
										variant='contained'
										size='large'
										className={classes.darkModeButton}
										onClick={() => {
											navigate('/login');
										}}
									>
										Sign In
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</div>
				</Grid>
			</Grid>
		</Container>
	);
}
