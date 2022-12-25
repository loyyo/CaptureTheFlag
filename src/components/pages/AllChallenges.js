import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Typography from '@material-ui/core/Typography';

import { useAuth } from '../../contexts/AuthContext';
import LinearProgress from '@material-ui/core/LinearProgress';

import Challenges from '../Challenges';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},
	tabs: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
	appbar: {
		background: theme.palette.primary.dark,
	},
	loading: {
		width: '100%',
	},
}));

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`category-tabpanel-${index}`}
			aria-labelledby={`category-tab-${index}`}
			{...other}
		>
			{value === index && <Box m={1}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};

function a11yProps(index) {
	return {
		id: `category-tab-${index}`,
		'aria-controls': `category-tabpanel-${index}`,
	};
}

export default function AllChallenges() {
	const classes = useStyles();

	const [value, setValue] = useState(0);
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const { getAllChallengesData, allChallengesData, getProfile, currentUserData } = useAuth();

	const theme = useTheme();
	const matches = useMediaQuery(theme.breakpoints.down('sm'));

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
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' className='leaderboard-header'>
							Available Challenges
						</Typography>
						<Divider />
					</Grid>
					<Grid item xs={12}>
						<div className={classes.tabs}>
							<AppBar position='static' className={classes.appbar}>
								<Tabs value={value} onChange={handleChange} centered aria-label='category'>
									<Tab label='All' {...a11yProps(0)} />
									<Tab label='Europe' {...a11yProps(1)} />
									<Tab label='Asia' {...a11yProps(2)} />
									<Tab label='Africa' {...a11yProps(3)} />
									<Tab hidden={matches} label='America' {...a11yProps(4)} />
								</Tabs>
							</AppBar>
							<TabPanel value={value} index={0}>
								<Challenges
									category={'all'}
									allChallengesData={allChallengesData}
									currentUserData={currentUserData}
								/>
							</TabPanel>
							<TabPanel value={value} index={1}>
								<Challenges
									category={'Europe'}
									allChallengesData={allChallengesData}
									currentUserData={currentUserData}
								/>
							</TabPanel>
							<TabPanel value={value} index={2}>
								<Challenges
									category={'Asia'}
									allChallengesData={allChallengesData}
									currentUserData={currentUserData}
								/>
							</TabPanel>
							<TabPanel value={value} index={3}>
								<Challenges
									category={'Africa'}
									allChallengesData={allChallengesData}
									currentUserData={currentUserData}
								/>
							</TabPanel>
							<TabPanel value={value} index={4}>
								<Challenges
									category={'America'}
									allChallengesData={allChallengesData}
									currentUserData={currentUserData}
								/>
							</TabPanel>
						</div>
					</Grid>
				</Grid>
			</div>
		</Container>
	);
}
