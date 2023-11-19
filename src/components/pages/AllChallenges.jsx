import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import {
	CssBaseline,
	Container,
	Grid,
	Box,
	Typography,
	LinearProgress,
	AppBar,
	Tabs,
	Tab,
	Divider,
	useMediaQuery,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext.jsx';

import Challenges from '../Challenges.jsx';

const PREFIX = 'AllChallenges';

const classes = {
	paper: `${PREFIX}-paper`,
	tabs: `${PREFIX}-tabs`,
	appbar: `${PREFIX}-appbar`,
	loading: `${PREFIX}-loading`,
};

const StyledContainer = styled(Container)(({ theme }) => ({
	[`& .${classes.paper}`]: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
	},

	[`& .${classes.tabs}`]: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},

	[`& .${classes.appbar}`]: {
		background: theme.palette.primary.dark,
	},

	[`& .${classes.loading}`]: {
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

function a11yProps(index) {
	return {
		id: `category-tab-${index}`,
		'aria-controls': `category-tabpanel-${index}`,
	};
}

export default function AllChallenges() {
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
				<Grid container direction='column'>
					<Grid item xs={12}>
						<Typography variant='h4' className='header-text'>
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

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.any.isRequired,
	value: PropTypes.any.isRequired,
};
