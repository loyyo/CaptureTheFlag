import { useTheme } from '@mui/material/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	Paper,
	Button,
	useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const navigate = useNavigate();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

	return (
		<Container
			component='main'
			maxWidth='md'
			sx={{
				mt: 4,
				mb: 2,
				minHeight: '91.4vh',
			}}
		>
			<CssBaseline />
			<Grid container spacing={5}>
				<Grid item xs={12}>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: isMobile ? 'center' : 'flex-start',
							mt: isMobile ? 0 : 8,
						}}
					>
						<Paper elevation={0}>
							<Box m={3}>
								<Typography variant='h4' align='center'>
									Welcome to Brainplex
								</Typography>

								<Paper variant='outlined' sx={{ mt: 2, p: 2 }}>
									<Typography variant='h5' align='center'>
										Brainplex is a platform that enables people to learn, practice{' '}
										{!isMobile && <br />} and compete in the various different fields.
									</Typography>
								</Paper>
							</Box>
							<Grid justifyContent='center' container spacing={3}>
								<Grid item>
									<Button
										type='button'
										fullWidth
										variant='contained'
										color='primary'
										size='large'
										sx={{ margin: theme.spacing(2.5, 0, 2.5), color: 'white' }}
										onClick={() => {
											navigate('/register');
										}}
									>
										Sign up
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
