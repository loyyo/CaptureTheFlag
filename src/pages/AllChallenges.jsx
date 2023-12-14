import {useState, useEffect, useMemo, useRef} from 'react';
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
    MenuItem,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Autocomplete from '@mui/lab/Autocomplete';
import {useAuth} from '../contexts/AuthContext.jsx';
import Challenges from '../components/Challenges.jsx';

function AllChallenges() {
    const [selectedTitle, setSelectedTitle] = useState('');
    const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
    const [difficultyFilterMenuAnchorEl, setDifficultyFilterMenuAnchorEl] = useState(null);
    const [ratingFilterMenuAnchorEl, setRatingFilterMenuAnchorEl] = useState(null);
    const [selectedSort, setSelectedSort] = useState('dateCreated');
    const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('');
    const [selectedRatingFilter, setSelectedRatingFilter] = useState('');

    const [isSortButtonClicked, setIsSortButtonClicked] = useState(false);
    const [isDifficultyButtonClicked, setIsDifficultyButtonClicked] = useState(false);
    const [isRatingButtonClicked, setIsRatingButtonClicked] = useState(false);

    const {getAllChallengesData, allChallengesData, getProfile, currentUserData} = useAuth();
    const theme = useTheme();

    const sortButtonRef = useRef(null);
    const difficultyButtonRef = useRef(null);
    const ratingButtonRef = useRef(null);

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
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 'calc(100vh - 90px)' // Header height
                }}>
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
            <Paper elevation={7} sx={{padding: 2, borderRadius: '4px'}}>
                <Box mt={5} mb={5}>
                    <Grid container direction="column">
                        <Grid item xs={12}>
                            <Typography variant="h4" align="center">
                                Available Challenges
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{marginTop: 20}}>
                            <Autocomplete
                                options={challengeTitles}
                                open={false}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder="Search Challenges by Title"
                                        variant="outlined"
                                        fullWidth
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: <SearchIcon/>,
                                            endAdornment: null,
                                        }}
                                    />
                                )}
                                onInputChange={(event, newInputValue) => {
                                    setSelectedTitle(newInputValue);
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} style={{marginTop: 20}}>
                            <Button
                                color='inherit'
                                ref={sortButtonRef}
                                variant={isSortButtonClicked ? "contained" : "outlined"}
                                onClick={(event) => {
                                    setSortMenuAnchorEl(event.currentTarget);
                                    setIsSortButtonClicked(true);
                                }}
                            >
                                {displaySortLabel()} <ArrowDropDownIcon/>
                            </Button>
                            <Menu
                                anchorEl={sortMenuAnchorEl}
                                keepMounted
                                open={Boolean(sortMenuAnchorEl)}
                                onClose={() => setSortMenuAnchorEl(null)}
                                sx={{
                                    "& .MuiPaper-root": {
                                        width: sortButtonRef.current ? `${sortButtonRef.current.offsetWidth}px` : 'auto'
                                    }
                                }}
                            >
                                <MenuItem onClick={() => {
                                    setSelectedSort('dateCreated');
                                    setSortMenuAnchorEl(null);
                                    setIsSortButtonClicked(false);
                                }}>Date Created</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedSort('alphabetical');
                                    setSortMenuAnchorEl(null);
                                    setIsSortButtonClicked(false);
                                }}>Alphabetical</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedSort('popularity');
                                    setSortMenuAnchorEl(null);
                                    setIsSortButtonClicked(false);
                                }}>Popularity</MenuItem>
                            </Menu>
                            <Button
                                color='inherit'
                                ref={difficultyButtonRef}
                                variant={isDifficultyButtonClicked ? "contained" : "outlined"}
                                onClick={(event) => {
                                    setDifficultyFilterMenuAnchorEl(event.currentTarget);
                                    setIsDifficultyButtonClicked(true);
                                }}
                            >
                                {displayDifficultyLabel()} <ArrowDropDownIcon/>
                            </Button>
                            <Menu
                                anchorEl={difficultyFilterMenuAnchorEl}
                                keepMounted
                                open={Boolean(difficultyFilterMenuAnchorEl)}
                                onClose={() => setDifficultyFilterMenuAnchorEl(null)}
                                sx={{
                                    "& .MuiPaper-root": {
                                        width: difficultyButtonRef.current ? `${difficultyButtonRef.current.offsetWidth}px` : 'auto'
                                    }
                                }}
                            >
                                <MenuItem onClick={() => {
                                    setSelectedDifficultyFilter('');
                                    setDifficultyFilterMenuAnchorEl(null);
                                    setIsDifficultyButtonClicked(false);
                                }}>All</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedDifficultyFilter('easy');
                                    setDifficultyFilterMenuAnchorEl(null);
                                    setIsDifficultyButtonClicked(false);
                                }}>Easy</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedDifficultyFilter('medium');
                                    setDifficultyFilterMenuAnchorEl(null);
                                    setIsDifficultyButtonClicked(false);
                                }}>Medium</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedDifficultyFilter('hard');
                                    setDifficultyFilterMenuAnchorEl(null);
                                    setIsDifficultyButtonClicked(false);
                                }}>Hard</MenuItem>
                            </Menu>
                            <Button
                                color='inherit'
                                ref={ratingButtonRef}
                                variant={isRatingButtonClicked ? "contained" : "outlined"}
                                onClick={(event) => {
                                    setRatingFilterMenuAnchorEl(event.currentTarget);
                                    setIsRatingButtonClicked(true);
                                }}
                            >
                                {displayRatingLabel()} <ArrowDropDownIcon/>
                            </Button>
                            <Menu
                                anchorEl={ratingFilterMenuAnchorEl}
                                keepMounted
                                open={Boolean(ratingFilterMenuAnchorEl)}
                                onClose={() => setRatingFilterMenuAnchorEl(null)}
                                sx={{
                                    "& .MuiPaper-root": {
                                        width: ratingButtonRef.current ? `${ratingButtonRef.current.offsetWidth}px` : 'auto'
                                    }
                                }}
                            >
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(0);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>All</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(1);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>1+</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(2);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>2+</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(3);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>3+</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(4);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>4+</MenuItem>
                                <MenuItem onClick={() => {
                                    setSelectedRatingFilter(5);
                                    setRatingFilterMenuAnchorEl(null);
                                    setIsRatingButtonClicked(false);
                                }}>5</MenuItem>
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
            </Paper>
        </Container>
    );
}

export default AllChallenges;
