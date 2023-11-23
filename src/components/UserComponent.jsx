import { useTheme } from '@mui/material/styles';

import {
	Paper,
	Divider,
	Grid,
	ImageList,
	Box,
	Avatar,
	Typography,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Checkbox,
	useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function UserProfile({ currentUserData, allChallengesData }) {
	const navigate = useNavigate();

	const theme = useTheme();
	const lg = useMediaQuery(theme.breakpoints.up('md'));
	const md = useMediaQuery(theme.breakpoints.down('md'));
	const xs = useMediaQuery(theme.breakpoints.down('xs'));

	const screenSize = () => {
		if (lg) {
			return 3;
		}
		if (md) {
			if (xs) {
				return 1;
			}
			return 3;
		}
	};

	return (
		<Paper variant='elevation' elevation={6}>
			<Grid container>
				<Grid item xs={12}>
					<Typography variant='h4' className='header-text'>
						{currentUserData.username}
					</Typography>
				</Grid>
				<Grid item xs={12} lg={3}>
					<Box m={2} mb={2}>
						<Paper variant='outlined'>
							<Box m={2} mb={1} ml={3} pr={2} mr={1}>
								<Paper variant='outlined'>
									<Avatar
										variant='rounded'
										alt='default_avatar'
										src={currentUserData.avatar}
										sx={{ width: '200px', height: '200px', margin: 'auto' }}
										style={{ padding: '0.5rem' }}
									/>
									<Divider variant='middle' />
									<Box pb={1} pt={1}>
										<Typography align='center' display='block' variant='overline'>
											<strong>{currentUserData.username}</strong>
										</Typography>
									</Box>
								</Paper>
							</Box>
							<Box p={1} ml={1} pl={2} pr={4} mb={1} mr={-1}>
								<Paper variant='outlined'>
									<Box m={2} mb={2}>
										<Typography display='block' variant='h6'>
											Bio
										</Typography>
										<Typography display='block' variant='body2' style={{ wordWrap: 'break-word' }}>
											{currentUserData.bio}
										</Typography>
									</Box>
								</Paper>
							</Box>
						</Paper>
					</Box>
				</Grid>
				<Grid item xs={12} lg={9}>
					<Box m={2} mb={2} ml={3}>
						<Paper variant='outlined'>
							<Box mb={1} mt={1}>
								<Typography align='center' display='block' variant='h5'>
									Points: {currentUserData.points}
								</Typography>
							</Box>
							<Divider variant='middle' />
							<Box mt={1}>
								<Typography align='center' display='block' variant='h5'>
									Completed Challenges:
								</Typography>
								<Box mt={1}>
									<Divider />
									<Divider />
									<ImageList
										rowHeight='auto'
										gap={0}
										cols={screenSize()}
										sx={{
											width: '100%',
											backgroundColor: theme.palette.background.paper,
											// display: 'flex',
											flexDirection: 'row',
											// padding: 0,
										}}
									>
										{allChallengesData.map((e) => {
											return (
												<ListItemButton
													sx={{ cursor: 'default' }}
													divider
													onClick={() => {
														navigate(`/challenges/${e.url}`);
													}}
													key={e.title.replaceAll(' ', '_')}
												>
													<Divider orientation='vertical' />
													<ListItemIcon>
														<Checkbox
															sx={{ cursor: 'default' }}
															edge='end'
															checked={currentUserData.challenges[e.url]}
															disableRipple
															disabled
															color='primary'
														/>
													</ListItemIcon>
													<ListItemText id='challenge1' primary={e.title} />
													<Divider orientation='vertical' />
												</ListItemButton>
											);
										})}
									</ImageList>
								</Box>
							</Box>
						</Paper>
					</Box>
				</Grid>
			</Grid>
		</Paper>
	);
}

UserProfile.propTypes = {
	currentUserData: PropTypes.object.isRequired,
	allChallengesData: PropTypes.array.isRequired,
};
