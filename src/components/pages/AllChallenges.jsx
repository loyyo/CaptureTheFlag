import React, {useState, useEffect, useMemo} from 'react';
import {
    useTheme,
    CssBaseline,
    Container,
    Grid,
    Box,
    Typography,
    LinearProgress,
    TextField,
    Button,
    Menu,
    MenuItem
} from '@mui/material';
import Autocomplete from '@mui/lab/Autocomplete';
import PropTypes from 'prop-types';
import {useAuth} from '../../contexts/AuthContext.jsx';
import Challenges from '../Challenges.jsx';

function AllChallenges() {
    const [selectedTitle, setSelectedTitle] = useState('');
    const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
    const [difficultyFilterMenuAnchorEl, setDifficultyFilterMenuAnchorEl] = useState(null);
    const [ratingFilterMenuAnchorEl, setRatingFilterMenuAnchorEl] = useState(null);
    const [selectedSort, setSelectedSort] = useState('dateCreated');
    const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('');
    const [selectedRatingFilter, setSelectedRatingFilter] = useState('');

    const {getAllChallengesData, allChallengesData, getProfile, currentUserData} = useAuth();
    const theme = useTheme();

    useEffect(() => {
        if (!currentUserData) {
            getProfile();
        }
        if (allChallengesData.length === 0) {
            getAllChallengesData();
        }
    }, [currentUserData, allChallengesData, getProfile, getAllChallengesData]);

    const challengeTitles = useMemo(() => allChallengesData.map(challenge => challenge.title), [allChallengesData]);

    const applySorting = (data) => {
        let sortedData = [...data];
        switch (selectedSort) {
            case 'dateCreated':
                sortedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'alphabetical':
                sortedData.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'popularity':
                sortedData.sort((a, b) => b.completedBy - a.completedBy);
                break;
            default:
                break;
        }
        console.log(sortedData)
        return sortedData;
    };

    const calculateAverageRating = (ratings) => {
        const ratingValues = Object.values(ratings).map(rating => parseInt(rating));
        const total = ratingValues.reduce((acc, curr) => acc + curr, 0);
        return ratingValues.length > 0 ? total / ratingValues.length : 0;
    };

    const applyFilters = (data) => {
        return data
            .filter(challenge => selectedTitle ? challenge.title.toLowerCase().includes(selectedTitle.toLowerCase()) : true)
            .filter(challenge => selectedDifficultyFilter ? challenge.difficulty === selectedDifficultyFilter : true)
            .filter(challenge => selectedRatingFilter ? calculateAverageRating(challenge.ratings) >= selectedRatingFilter : true);
    };

    const sortedAndFilteredChallenges = applySorting(applyFilters(allChallengesData));

    const displaySortLabel = () => {
        switch (selectedSort) {
            case 'dateCreated':
                return 'Date Created';
            case 'alphabetical':
                return 'Alphabetical';
            case 'popularity':
                return 'Popularity';
            default:
                return 'Sort';
        }
    };

    const displayDifficultyLabel = () => {
        return selectedDifficultyFilter ? selectedDifficultyFilter.charAt(0).toUpperCase() + selectedDifficultyFilter.slice(1) : 'Difficulty';
    };

    const displayRatingLabel = () => {
        return selectedRatingFilter ? `${selectedRatingFilter}+ Stars` : 'Rating';
    };

    if (!currentUserData || allChallengesData.length === 0) {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline/>
                <Box sx={{width: '100%'}}>
                    <Box m={10}>
                        <LinearProgress/>
                    </Box>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <CssBaseline/>
            <Box mt={5} mb={5}>
                <Grid container direction="column">
                    <Grid item xs={12}>
                        <Typography variant="h4" className="header-text">
                            Available Challenges
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style={{marginTop: 20}}>
                        <Autocomplete
                            options={challengeTitles}
                            renderInput={(params) => <TextField {...params} label="Search Challenges by Title"
                                                                variant="outlined" fullWidth/>}
                            onInputChange={(event, newInputValue) => {
                                setSelectedTitle(newInputValue);
                            }}
                            filterOptions={(options, {inputValue}) =>
                                options.filter(option =>
                                    option.toLowerCase().includes(inputValue.toLowerCase())
                                )
                            }
                        />
                    </Grid>
                    <Grid item xs={12} style={{marginTop: 20}}>
                        <Button
                            onClick={(event) => setSortMenuAnchorEl(event.currentTarget)}>{displaySortLabel()}</Button>
                        <Menu
                            anchorEl={sortMenuAnchorEl}
                            keepMounted
                            open={Boolean(sortMenuAnchorEl)}
                            onClose={() => setSortMenuAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setSelectedSort('dateCreated')}>Date Created</MenuItem>
                            <MenuItem onClick={() => setSelectedSort('alphabetical')}>Alphabetical</MenuItem>
                            <MenuItem onClick={() => setSelectedSort('popularity')}>Popularity</MenuItem>
                        </Menu>

                        <Button
                            onClick={(event) => setDifficultyFilterMenuAnchorEl(event.currentTarget)}>{displayDifficultyLabel()}</Button>
                        <Menu
                            anchorEl={difficultyFilterMenuAnchorEl}
                            keepMounted
                            open={Boolean(difficultyFilterMenuAnchorEl)}
                            onClose={() => setDifficultyFilterMenuAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setSelectedDifficultyFilter('')}>All</MenuItem>
                            <MenuItem onClick={() => setSelectedDifficultyFilter('easy')}>Easy</MenuItem>
                            <MenuItem onClick={() => setSelectedDifficultyFilter('medium')}>Medium</MenuItem>
                            <MenuItem onClick={() => setSelectedDifficultyFilter('hard')}>Hard</MenuItem>
                        </Menu>

                        <Button
                            onClick={(event) => setRatingFilterMenuAnchorEl(event.currentTarget)}>{displayRatingLabel()}</Button>
                        <Menu
                            anchorEl={ratingFilterMenuAnchorEl}
                            keepMounted
                            open={Boolean(ratingFilterMenuAnchorEl)}
                            onClose={() => setRatingFilterMenuAnchorEl(null)}
                        >
                            <MenuItem onClick={() => setSelectedRatingFilter(0)}>All</MenuItem>
                            <MenuItem onClick={() => setSelectedRatingFilter(1)}>1+</MenuItem>
                            <MenuItem onClick={() => setSelectedRatingFilter(2)}>2+</MenuItem>
                            <MenuItem onClick={() => setSelectedRatingFilter(3)}>3+</MenuItem>
                            <MenuItem onClick={() => setSelectedRatingFilter(4)}>4+</MenuItem>
                            <MenuItem onClick={() => setSelectedRatingFilter(5)}>5</MenuItem>
                        </Menu>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{flexGrow: 1, backgroundColor: theme.palette.background.paper, marginTop: 2}}>
                            <Challenges
                                allChallengesData={sortedAndFilteredChallenges}
                                currentUserData={currentUserData}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}

export default AllChallenges;
