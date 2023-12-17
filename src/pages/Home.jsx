import { useTheme } from '@mui/material/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Divider,
	Paper,
	Button,
	useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Container component="main" maxWidth="md" sx={{
			mt: 2,
			mb: isMobile ? 8 : 0,
			height: isMobile ? 'auto' : 'calc(100vh - 40px)'
		}}>
			<CssBaseline />
			<Grid container spacing={5}>
				<Grid item xs={12}>
					<Box sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: isMobile ? 'center' : 'flex-start',
						height: isMobile ? 'calc(100vh - 90px)' : 'auto',
						mt: isMobile ? 0 : 8
					}}>
						<Paper variant='outlined'>
							<Box m={3}>
								<Typography variant='h4' align="center">
									Welcome to Brainplex
								</Typography>

								<Paper variant='outlined' sx={{ mt: 2, p: 2 }}>
									<Typography variant='h5' align="center">
										Brainplex is a platform that enables people to learn,
										practice {!isMobile && <br/>} and compete in the various different fields.
									</Typography>
								</Paper>
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
										sx={{ margin: theme.spacing(2.5, 0, 2.5), color: 'white', }}
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
										sx={{
											margin: theme.spacing(2.5, 0, 2.5),
											color: 'white',
											'&:hover': {
												backgroundColor: theme.palette.primary.dark,
											},
										}}
										onClick={() => {
											navigate('/login');
										}}
									>
										Sign In
									</Button>
								</Grid>
							</Grid>
						</Paper>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
