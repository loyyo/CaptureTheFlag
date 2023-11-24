import React, { useState, useEffect, useMemo } from 'react';
import { useTheme, CssBaseline, Container, Grid, Box, Typography, LinearProgress, AppBar, Tabs, Tab, Divider, useMediaQuery, TextField } from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Challenges from '../Challenges.jsx';

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
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
	const [value, setValue] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState('all');

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
	}, [currentUserData, allChallengesData, getProfile, getAllChallengesData]);

	const categories = useMemo(() => {
		const uniqueCategories = new Set(['All']); // Dodaj opcję "Wszystko"
		allChallengesData.forEach(challenge => {
			if (challenge.category) {
				uniqueCategories.add(challenge.category);
			}
		});
		return Array.from(uniqueCategories);
	}, [allChallengesData]);

    const handleCategoryChange = (event, newValue) => {
        if (newValue === null) {
            setSelectedCategory('all');
        } else {
            setSelectedCategory(newValue === 'All' ? 'all' : newValue);
        }
    };


	if (!currentUserData || allChallengesData.length === 0) {
		return (
			<Container component="main" maxWidth="lg">
				<CssBaseline />
				<Box sx={{ width: '100%' }}>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	}

	const filteredChallenges = selectedCategory === 'all'
		? allChallengesData
		: allChallengesData.filter(challenge => challenge.category === selectedCategory);

	return (
		<Container maxWidth="lg">
			<CssBaseline />
			<Box mt={5} mb={5}>
				<Grid container direction="column">
					<Grid item xs={12}>
						<Typography variant="h4" className="header-text">
							Available Challenges
						</Typography>
						<Divider />
					</Grid>
					<Grid item xs={12} style={{ marginTop: 20 }}>
						<Autocomplete
							options={categories}
							defaultValue="All"
							onChange={handleCategoryChange}
							renderInput={(params) => (
								<TextField {...params} label="Choose a category" variant="outlined" fullWidth />
							)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ flexGrow: 1, backgroundColor: theme.palette.background.paper, marginTop: 2 }}>
							<Challenges
								category={selectedCategory}
								allChallengesData={filteredChallenges}
								currentUserData={currentUserData}
							/>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
}
