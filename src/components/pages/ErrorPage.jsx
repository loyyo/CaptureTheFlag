import { styled } from '@mui/material/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Paper,
	Button,
	Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PREFIX = 'Error';

const classes = {
	paper: `${PREFIX}-paper`,
	button: `${PREFIX}-button`,
	darkModeButton: `${PREFIX}-darkModeButton`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(15),
		marginBottom: theme.spacing(5),
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

export default function ErrorPage() {
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	return (
		<StyledContainer maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
				<Grid container>
					<Grid item xs={1} />
					<Grid item xs={10}>
						<Paper variant='outlined'>
							<Box mb={3} mt={3} mr={5} ml={5}>
								<Typography variant='h5' gutterBottom>
									Flaga dla zadania europe1 to polska, ale ciii, nikomu nie mów
								</Typography>
							</Box>
							{!currentUser && (
								<>
									<Divider variant='middle' />
									<Grid justifyContent='center' container spacing={2} row>
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
									<Grid item xs={1} />
								</>
							)}
						</Paper>
					</Grid>
				</Grid>
			</div>
		</StyledContainer>
	);
}
