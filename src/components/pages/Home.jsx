import { styled } from '@mui/material/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Divider,
	Paper,
	Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const PREFIX = 'Home';

const classes = {
	paper: `${PREFIX}-paper`,
	button: `${PREFIX}-button`,
	darkModeButton: `${PREFIX}-darkModeButton`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(5),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},

	[`& .${classes.button}`]: {
		margin: theme.spacing(2.5, 0, 2.5),
	},

	[`& .${classes.darkModeButton}`]: {
		margin: theme.spacing(2.5, 0, 2.5),
		backgroundColor: theme.palette.primary.light,
		color: 'white',
		'&:hover': {
			backgroundColor: theme.palette.primary.dark,
		},
	},
}));

export default function Home() {
	const navigate = useNavigate();

	return (
		<StyledContainer maxWidth='md'>
			<CssBaseline />
			<Grid container spacing={5}>
				<Grid item xs={12}>
					<div className={classes.paper}>
						<Paper variant='outlined'>
							<Box m={3}>
								<Typography variant='h4' className='header-text'>
									Welcome to Capture The Flag!
								</Typography>
								<Typography variant='h5' className='description'>
									CaptureTheFlag is a platform that enables people to learn, practice, and compete
									in the field of geography, specifically world&apos;s flags.
								</Typography>
								<Typography variant='h5' className='header-text-dark'>
									JOIN AND CATCH&apos;EM ALL!
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
		</StyledContainer>
	);
}
