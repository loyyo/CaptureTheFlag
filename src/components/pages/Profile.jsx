import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
	CssBaseline,
	Paper,
	Container,
	Divider,
	Grid,
	ImageList,
	Box,
	Avatar,
	Typography,
	ListItem,
	ListItemIcon,
	ListItemText,
	Checkbox,
	LinearProgress,
	Button,
	useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

const PREFIX = 'Profile';

const classes = {
	list: `${PREFIX}-list`,
	paper: `${PREFIX}-paper`,
	button: `${PREFIX}-button`,
	avatar: `${PREFIX}-avatar`,
	avatarbox: `${PREFIX}-avatarbox`,
	loading: `${PREFIX}-loading`,
	listitem: `${PREFIX}-listitem`,
	checkbox: `${PREFIX}-checkbox`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.list}`]: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		// display: 'flex',
		flexDirection: 'row',
		// padding: 0,
	},

	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},

	[`& .${classes.button}`]: {
		margin: theme.spacing(0.5, 0, 0.5),
	},

	[`& .${classes.avatar}`]: {
		width: '200px',
		height: '200px',
		margin: 'auto',
	},

	[`& .${classes.avatarbox}`]: {},

	[`& .${classes.loading}`]: {
		width: '100%',
	},

	[`& .${classes.listitem}`]: {
		cursor: 'default',
	},

	[`& .${classes.checkbox}`]: {
		cursor: 'default',
	},
}));

export default function Profile() {
	const navigate = useNavigate();
	const { getProfile, currentUserData, allChallengesData, getAllChallengesData } = useAuth();
	const [catchedThemAll, setCatchedThemAll] = useState(true);

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

	useEffect(() => {
		if (!currentUserData) {
			getProfile();
		}
		if (allChallengesData.length === 0) {
			getAllChallengesData();
		}
	});

	useEffect(() => {
		if (allChallengesData.length > 0 && currentUserData) {
			allChallengesData.forEach((e) => {
				if (!currentUserData.challenges[e.url]) setCatchedThemAll(false);
			});
		}
	}, [currentUserData, allChallengesData]);

	if (!currentUserData || allChallengesData.length === 0) {
		return (
			<StyledContainer component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</StyledContainer>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
				<Paper variant='elevation' elevation={6}>
					<Grid container>
						<Grid item xs={12}>
							<Typography variant='h4' className='header-text'>
								Your Profile
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
												className={classes.avatar}
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
												<Typography
													display='block'
													variant='body2'
													style={{ wordWrap: 'break-word' }}
												>
													{currentUserData.bio}
												</Typography>
											</Box>
										</Paper>
									</Box>
									<Box m={1} mr={3} ml={3} mt={-1}>
										<Button
											type='button'
											fullWidth
											variant='contained'
											color='primary'
											className={classes.button}
											onClick={() => {
												navigate('/profile/settings');
											}}
										>
											Edit Profile
										</Button>
									</Box>
								</Paper>
							</Box>
						</Grid>
						<Grid item xs={12} lg={9}>
							<Box m={2} mb={2} ml={3}>
								<Paper variant='outlined'>
									{catchedThemAll && (
										<>
											<Box mb={1} mt={1}>
												<Typography align='center' display='block' variant='h5'>
													YOU&apos;VE CATCHED THEM ALL!
												</Typography>
											</Box>
											<Divider />
										</>
									)}
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
												className={classes.list}
											>
												{allChallengesData.map((e) => {
													return (
														<ListItem
															className={classes.listitem}
															divider
															button
															onClick={() => {
																navigate(`/challenges/${e.url}`);
															}}
															key={e.title.replaceAll(' ', '_')}
														>
															<Divider orientation='vertical' />
															<ListItemIcon>
																<Checkbox
																	className={classes.checkbox}
																	edge='end'
																	checked={currentUserData.challenges[e.url]}
																	disableRipple
																	disabled
																	color='primary'
																/>
															</ListItemIcon>
															<ListItemText id='challenge1' primary={e.title} />
															<Divider orientation='vertical' />
														</ListItem>
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
			</div>
		</Container>
	);
}
