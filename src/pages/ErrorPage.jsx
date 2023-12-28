import { useTheme } from '@mui/material/styles';
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
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ErrorPage() {
	const theme = useTheme();
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<Box
				mt={2}
				mb={5}
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Grid container>
					<Grid item xs={1} />
					<Grid item xs={10}>
						<Paper variant='outlined' sx={{ border: '2px solid #252028' }}>
							<Box mb={3} mt={3} mr={5} ml={5}>
								<Typography variant='h5' gutterBottom>
									Error
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
												sx={{ margin: theme.spacing(2.5, 0, 2.5) }}
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
													backgroundColor: theme.palette.primary.light,
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
									<Grid item xs={1} />
								</>
							)}
						</Paper>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
