import { useState, useEffect, useMemo, useRef } from 'react';
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
	Paper,
	useMediaQuery,
	Popover,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Autocomplete from '@mui/lab/Autocomplete';
import { useAuth } from '../contexts/AuthContext.jsx';
import Challenges from '../components/Challenges.jsx';

function AllChallenges() {
	const [selectedTitle, setSelectedTitle] = useState('');
	const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
	const [difficultyFilterMenuAnchorEl, setDifficultyFilterMenuAnchorEl] = useState(null);
	const [ratingFilterMenuAnchorEl, setRatingFilterMenuAnchorEl] = useState(null);
	const [selectedSort, setSelectedSort] = useState('dateCreated');
	const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState('');
	const [selectedRatingFilter, setSelectedRatingFilter] = useState(0);

	const { getAllChallengesData, allChallengesData, getProfile, currentUserData } = useAuth();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md')); // useMediaQuery hook called at the top level

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

	const challengeTitles = useMemo(
		() => allChallengesData.map((challenge) => challenge.title),
		[allChallengesData]
	);

	const applySorting = (data) => {
		let sortedData = [...data];
		switch (selectedSort) {
			case 'dateCreated':
				sortedData.sort((a, b) => {
					const dateA = new Date(a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000);
					const dateB = new Date(b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000);
					return dateB - dateA;
				});
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

	const handleOpenPopover = (event, popoverSetter) => {
		popoverSetter(event.currentTarget);
	};

	const handleClosePopover = (popoverSetter) => {
		popoverSetter(null);
	};
	const calculateAverageRating = (ratings) => {
		const ratingValues = Object.values(ratings).map((rating) => parseInt(rating));
		const total = ratingValues.reduce((acc, curr) => acc + curr, 0);
		return ratingValues.length > 0 ? total / ratingValues.length : 0;
	};

	const applyFilters = (data) => {
		return data
			.filter((challenge) =>
				selectedTitle ? challenge.title.toLowerCase().includes(selectedTitle.toLowerCase()) : true
			)
			.filter((challenge) =>
				selectedDifficultyFilter ? challenge.difficulty === selectedDifficultyFilter : true
			)
			.filter((challenge) =>
				selectedRatingFilter
					? calculateAverageRating(challenge.ratings) >= selectedRatingFilter
					: true
			);
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
		return selectedDifficultyFilter
			? selectedDifficultyFilter.charAt(0).toUpperCase() + selectedDifficultyFilter.slice(1)
			: 'Difficulty';
	};

	const displayRatingLabel = () => {
		return selectedRatingFilter ? `${selectedRatingFilter}+ Stars` : 'Rating';
	};

	if (!currentUserData || allChallengesData.length === 0) {
		return (
			<Container component='main' maxWidth='lg'>
				<CssBaseline />
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						height: 'calc(100vh - 90px)', // Header height
					}}
				>
					<Box m={10}>
						<LinearProgress />
					</Box>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth='lg' sx={{ minHeight: '93.15vh' }}>
			<CssBaseline />
			<Paper
				elevation={0}
				sx={{
					padding: isMobile ? '16px 20px' : '16px',
					borderRadius: '4px',
					mb: isMobile ? 8 : 2,
					mt: 2,
				}}
			>
				<Box mt={1} mb={5}>
					<Grid item xs={12} container spacing={2}>
						<Grid item xs={12}>
							<Typography variant='h4' align='center'>
								Available Challenges
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<Autocomplete
								options={challengeTitles}
								open={false}
								sx={{ border: '2px solid #252028' }}
								renderInput={(params) => (
									<TextField
										{...params}
										placeholder='Search Challenges by Title'
										variant='outlined'
										fullWidth
										InputProps={{
											...params.InputProps,
											startAdornment: <SearchIcon />,
											endAdornment: null,
										}}
									/>
								)}
								onInputChange={(event, newInputValue) => {
									setSelectedTitle(newInputValue);
								}}
							/>
						</Grid>
						{isMobile ? (
							<Grid item xs={12} container spacing={2}>
								{/* Sort Button */}
								<Grid item xs={12}>
									<Button
										color='inherit'
										ref={sortButtonRef}
										variant={selectedSort === 'dateCreated' ? 'outlined' : 'contained'}
										onClick={(event) => handleOpenPopover(event, setSortMenuAnchorEl)}
										fullWidth
									>
										{displaySortLabel()} <ArrowDropDownIcon />
									</Button>
									<Popover
										anchorEl={sortMenuAnchorEl}
										open={Boolean(sortMenuAnchorEl)}
										onClose={() => handleClosePopover(setSortMenuAnchorEl)}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										transformOrigin={{ vertical: 'top', horizontal: 'left' }}
										PaperProps={{
											style: {
												width: sortButtonRef.current ? sortButtonRef.current.offsetWidth : undefined
											}
										}}
									>
										<MenuItem onClick={() => setSelectedSort('dateCreated')}>Date Created</MenuItem>
										<MenuItem onClick={() => setSelectedSort('alphabetical')}>
											Alphabetical
										</MenuItem>
										<MenuItem onClick={() => setSelectedSort('popularity')}>Popularity</MenuItem>
									</Popover>
								</Grid>

								{/* Difficulty Button */}
								<Grid item xs={12}>
									<Button
										color='inherit'
										ref={difficultyButtonRef}
										variant={selectedDifficultyFilter === '' ? 'outlined' : 'contained'}
										onClick={(event) => handleOpenPopover(event, setDifficultyFilterMenuAnchorEl)}
										fullWidth
									>
										{displayDifficultyLabel()} <ArrowDropDownIcon />
									</Button>
									<Popover
										anchorEl={difficultyFilterMenuAnchorEl}
										open={Boolean(difficultyFilterMenuAnchorEl)}
										onClose={() => handleClosePopover(setDifficultyFilterMenuAnchorEl)}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										transformOrigin={{ vertical: 'top', horizontal: 'left' }}
										PaperProps={{
											style: {
												width: difficultyButtonRef.current ? difficultyButtonRef.current.offsetWidth : undefined
											}
										}}
									>
										{/* Popover content for difficulty */}
										<MenuItem onClick={() => setSelectedDifficultyFilter('')}>All</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('easy')}>Easy</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('medium')}>
											Medium
										</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('hard')}>Hard</MenuItem>
									</Popover>
								</Grid>

								{/* Rating Button */}
								<Grid item xs={12}>
									<Button
										color='inherit'
										ref={ratingButtonRef}
										variant={selectedRatingFilter === 0 ? 'outlined' : 'contained'}
										onClick={(event) => handleOpenPopover(event, setRatingFilterMenuAnchorEl)}
										fullWidth
									>
										{displayRatingLabel()} <ArrowDropDownIcon />
									</Button>
									<Popover
										anchorEl={ratingFilterMenuAnchorEl}
										open={Boolean(ratingFilterMenuAnchorEl)}
										onClose={() => handleClosePopover(setRatingFilterMenuAnchorEl)}
										anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
										transformOrigin={{ vertical: 'top', horizontal: 'left' }}
										PaperProps={{
											style: {
												width: difficultyButtonRef.current ? difficultyButtonRef.current.offsetWidth : undefined
											}
										}}
									>
										{/* Popover content for rating */}
										<MenuItem onClick={() => setSelectedRatingFilter(0)}>All</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(1)}>1+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(2)}>2+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(3)}>3+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(4)}>4+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(5)}>5 Stars</MenuItem>
									</Popover>
								</Grid>
							</Grid>
						) : (
							<Grid item xs={12} container spacing={8} justifyContent='space-between'>
								{' '}
								{/* Zwiększony odstęp */}
								<Grid item xs={12} md={4}>
									<Button
										color='inherit'
										ref={sortButtonRef}
										variant={selectedSort === 'dateCreated' ? 'outlined' : 'contained'}
										onClick={(event) => {
											setSortMenuAnchorEl(event.currentTarget);
										}}
										fullWidth
										sx={{ justifyContent: 'space-between', border: '2px solid #252028' }}
									>
										<Box sx={{ flexGrow: 1, textAlign: 'left' }}>{displaySortLabel()}</Box>
										<ArrowDropDownIcon />
									</Button>
									<Popover
										open={Boolean(sortMenuAnchorEl)}
										anchorEl={sortMenuAnchorEl}
										onClose={() => setSortMenuAnchorEl(null)}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										PaperProps={{
											style: {
												width: sortButtonRef.current
													? sortButtonRef.current.clientWidth
													: undefined,
											},
										}}
									>
										<MenuItem onClick={() => setSelectedSort('dateCreated')}>Date Created</MenuItem>
										<MenuItem onClick={() => setSelectedSort('alphabetical')}>
											Alphabetical
										</MenuItem>
										<MenuItem onClick={() => setSelectedSort('popularity')}>Popularity</MenuItem>
									</Popover>
								</Grid>
								<Grid item xs={12} md={4}>
									<Button
										color='inherit'
										ref={difficultyButtonRef}
										variant={selectedDifficultyFilter === '' ? 'outlined' : 'contained'}
										onClick={(event) => {
											setDifficultyFilterMenuAnchorEl(event.currentTarget);
										}}
										fullWidth
										sx={{ justifyContent: 'space-between', border: '2px solid #252028' }}
									>
										<Box sx={{ flexGrow: 1, textAlign: 'left' }}>{displayDifficultyLabel()}</Box>
										<ArrowDropDownIcon />
									</Button>
									<Popover
										open={Boolean(difficultyFilterMenuAnchorEl)}
										anchorEl={difficultyFilterMenuAnchorEl}
										onClose={() => setDifficultyFilterMenuAnchorEl(null)}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										PaperProps={{
											style: {
												width: difficultyButtonRef.current
													? difficultyButtonRef.current.clientWidth
													: undefined,
											},
										}}
									>
										<MenuItem onClick={() => setSelectedDifficultyFilter('')}>All</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('easy')}>Easy</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('medium')}>
											Medium
										</MenuItem>
										<MenuItem onClick={() => setSelectedDifficultyFilter('hard')}>Hard</MenuItem>
									</Popover>
								</Grid>
								<Grid item xs={12} md={4}>
									<Button
										color='inherit'
										ref={ratingButtonRef}
										variant={selectedRatingFilter === 0 ? 'outlined' : 'contained'}
										onClick={(event) => {
											setRatingFilterMenuAnchorEl(event.currentTarget);
										}}
										fullWidth
										sx={{ justifyContent: 'space-between', border: '2px solid #252028' }}
									>
										<Box sx={{ flexGrow: 1, textAlign: 'left' }}>{displayRatingLabel()}</Box>
										<ArrowDropDownIcon />
									</Button>
									<Popover
										open={Boolean(ratingFilterMenuAnchorEl)}
										anchorEl={ratingFilterMenuAnchorEl}
										onClose={() => setRatingFilterMenuAnchorEl(null)}
										anchorOrigin={{
											vertical: 'bottom',
											horizontal: 'left',
										}}
										transformOrigin={{
											vertical: 'top',
											horizontal: 'left',
										}}
										PaperProps={{
											style: {
												width: ratingButtonRef.current
													? ratingButtonRef.current.clientWidth
													: undefined,
											},
										}}
									>
										<MenuItem onClick={() => setSelectedRatingFilter(0)}>All</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(1)}>1+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(2)}>2+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(3)}>3+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(4)}>4+ Stars</MenuItem>
										<MenuItem onClick={() => setSelectedRatingFilter(5)}>5 Stars</MenuItem>
									</Popover>
								</Grid>
							</Grid>
						)}
						<Grid item xs={12}>
							<Box sx={{ flexGrow: 1, width: '100%' }}>
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
