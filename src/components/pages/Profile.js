import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import ImageList from '@material-ui/core/ImageList';
import Box from '@material-ui/core/Box';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles((theme) => ({
	list: {
		width: '100%',
		backgroundColor: theme.palette.background.paper,
		// display: 'flex',
		flexDirection: 'row',
		// padding: 0,
	},
	paper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},
	button: {
		margin: theme.spacing(0.5, 0, 0.5),
	},
	avatar: {
		width: '200px',
		height: '200px',
		margin: 'auto',
	},
	avatarbox: {},
	loading: {
		width: '100%',
	},
	listitem: {
		cursor: 'default',
	},
	checkbox: {
		cursor: 'default',
	},
}));

export default function Profile() {
	const classes = useStyles();
	const navigate = useNavigate();
	const { getProfile, currentUserData, allChallengesData, getAllChallengesData } = useAuth();

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

	if (!currentUserData || allChallengesData.length === 0) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<div className={classes.loading}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</div>
			</Container>
		);
	}

	return (
		<Container maxWidth='lg'>
			<CssBaseline />
			<div className={classes.paper}>
				<Paper variant='elevation' elevation={6}>
					<Grid container>
						<Grid item xs={12}>
							<Typography variant='h4' className='leaderboard-header'>
								Your Profile
							</Typography>
						</Grid>
						<Grid item xs={12} lg={3}>
							<Box m={2} mb={2}>
								<Paper variant='outlined' elevation={3}>
									<Box m={2} mb={1} ml={3} pr={2} mr={1}>
										<Paper variant='outlined' elevation={3}>
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
										<Paper variant='outlined' elevation={3}>
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
								<Paper variant='outlined' elevation={3}>
									{currentUserData.points === 10704 && (
										<>
											<Box mb={1} mt={1}>
												<Typography align='center' display='block' variant='h5'>
													YOU WON CTWDICTORY!
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
