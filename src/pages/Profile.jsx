import React, {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
import {
    CssBaseline,
    Paper,
    Container,
    Grid,
    Box,
    Avatar,
    Typography,
    LinearProgress,
    Button,
    useMediaQuery
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.jsx';
import Challenges from '../components/Challenges.jsx';
import CircularProgress from '@mui/material/CircularProgress';

export default function Profile() {
    const navigate = useNavigate();
    const {
        getProfile,
        currentUserData,
        allChallengesData,
        getAllChallengesData,
        getChallengeStats,
        allUsersData,
        getAllUsersData
    } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeTab, setActiveTab] = useState('informations');

    const [userData, setUserData] = useState(null);
    const [challengesData, setChallengesData] = useState([]);
    const userCreatedChallenges = allChallengesData.filter(challenge => currentUserData.userID === challenge.userID);

    const [usersDataLoaded, setUsersDataLoaded] = useState(false);

    const isInformationsTabActive = activeTab === 'informations';
    const isChallengesTabActive = activeTab === 'challenges';
    const hasUserCreatedChallenges = userCreatedChallenges.length > 0;


    useEffect(() => {
        const loadData = async () => {
            if (!currentUserData) {
                await getProfile();
            } else {
                setUserData(currentUserData);
            }

            if (allChallengesData.length === 0) {
                await getAllChallengesData();
            } else {
                setChallengesData(allChallengesData);
            }

            if (allUsersData.length === 0) {
                await getAllUsersData();
            }

            if (currentUserData && currentUserData.userID) {
                const stats = await getChallengeStats(currentUserData.userID, currentUserData.email);
                if (stats) {
                    setUserData(prevState => ({...prevState, ...stats}));
                }
            }
        };

        loadData().then(() => setUsersDataLoaded(true));
    }, [
        currentUserData,
        allChallengesData,
        allUsersData.length,
        getProfile,
        getAllChallengesData,
        getAllUsersData,
        getChallengeStats
    ]);
    if (!usersDataLoaded) {
        return (
            <Container component='main' maxWidth='lg'>
                <CssBaseline/>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <Typography variant='h4'>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    const calculatePercentage = (solved, total) => {
        return (solved / total) * 100;
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
        <Container component="main" maxWidth="md" sx={{
            mt: 2,
            mb: isMobile ? 100 : 0,
            height: isMobile ? 'auto' : 'calc(100vh - 90px)'
        }}>
            <CssBaseline/>
            <Paper elevation={7} sx={{padding: 2, borderRadius: '4px'}}>
                {/* Nagłówek strony i przyciski zakładek */}
                <Box p={2}>
                    <Typography variant='h4' align='center'>
                        Profile
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
                        <Box sx={{
                            width: '250px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '8px',
                            position: 'relative'
                        }} onClick={() => setActiveTab('informations')}>
                            <Typography>
                                Informations
                            </Typography>
                            {isInformationsTabActive && <Box sx={{
                                height: '4px',
                                backgroundColor: theme.palette.primary.main,
                                position: 'absolute',
                                bottom: 0,
                                left: '10%',
                                right: '10%',
                                borderRadius: '2px'
                            }}/>}
                        </Box>
                        <Box sx={{
                            width: '250px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            padding: '8px',
                            ml: 2,
                            position: 'relative'
                        }} onClick={() => setActiveTab('challenges')}>
                            <Typography>
                                Your Challenges
                            </Typography>
                            {isChallengesTabActive && <Box sx={{
                                height: '4px',
                                backgroundColor: theme.palette.primary.main,
                                position: 'absolute',
                                bottom: 0,
                                left: '10%',
                                right: '10%',
                                borderRadius: '2px'
                            }}/>}
                        </Box>
                    </Box>
                </Box>

                <Grid>
                    {isInformationsTabActive && (
                        <Grid container spacing={1} alignItems="stretch">
                            {/* Avatar, bio i opis */}
                            <Grid item xs={12} md={5}>
                                <Box display='flex' flexDirection='column' alignItems='center' mb={2}>
                                    {/* Otoczka wokół avatara i informacji */}
                                    <Paper elevation={1}
                                           sx={{
                                               p: 2,
                                               mb: 2,
                                               width: '95%',
                                               bgcolor: theme.palette.background.paper
                                           }}>
                                        <Box display='flex' flexDirection='row' alignItems='center'
                                             sx={{width: '100%', justifyContent: 'center'}}>
                                            <Avatar
                                                variant='rounded'
                                                alt='Profile Avatar'
                                                src={currentUserData.avatar}
                                                sx={{width: '100px', height: '100px', mr: 2}}
                                            />
                                            <Box>
                                                <Typography variant='h5'>{userData.username}</Typography>
                                                <Typography
                                                    variant='body1'>Rank: {userData.ranking === 0 ? "---" : userData.ranking}</Typography>
                                                <Typography variant='body1'>Points: {userData.points}</Typography>
                                            </Box>
                                        </Box>
                                    </Paper>

                                    {/* Otoczka tylko dla bio */}
                                    <Paper elevation={1}
                                           sx={{
                                               p: 2,
                                               mb: 2,
                                               width: '95%',
                                               bgcolor: theme.palette.background.paper
                                           }}>
                                        <Typography variant='body1'>{userData.bio}</Typography>
                                    </Paper>

                                    <Button
                                        variant='contained'
                                        color='primary'
                                        onClick={() => navigate('/profile/settings')}
                                        sx={{width: '95%', color: 'white'}}
                                    >
                                        Edit Profile
                                    </Button>
                                </Box>
                            </Grid>


                            {/* Solved challenges */}
                            <Grid item xs={12} md={7}>
                                <Paper elevation={3} sx={{p: 2, height: '100%', mb: 2}}>
                                    <Typography
                                        variant='h5'
                                        gutterBottom
                                        align={isMobile ? 'center' : 'left'}
                                    >
                                        Solved Challenges
                                    </Typography>

                                    <Grid container spacing={3} alignItems="center">
                                        {/* Koło z ilością wykonanych wyzwań */}
                                        <Grid item xs={12} md={4}> {/* Zmniejszono proporcję md do 4 */}
                                            <Box sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '100%'
                                            }}>
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={calculatePercentage(calculatePercentage, userData.totalChallenges)}
                                                    size={140}
                                                    thickness={4}
                                                />
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                    }}
                                                >
                                                    <Typography variant="caption" component="div" sx={{
                                                        textAlign: 'center',
                                                        fontSize: '24px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {userData.solvedChallenges}
                                                        <div style={{fontSize: '12px'}}>Solved</div>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Paski postępu */}
                                        <Grid item xs={12} md={7} sx={{marginLeft: 4}}>

                                            <Box>
                                                {/* Pasek postępu dla Easy Challenges */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 2
                                                }}>
                                                    <Typography variant='body1'>{`Easy`}</Typography>
                                                    <Typography
                                                        variant='body1'>{`${userData.solvedEasyChallenges}/${userData.totalEasyChallenges}`}</Typography>
                                                </Box>
                                                <div className='progress-bar'>
                                                    <div className='progress-fill' style={{
                                                        width: `${calculatePercentage(userData.solvedEasyChallenges, userData.totalEasyChallenges)}%`,
                                                        backgroundColor: theme.palette.primary.main
                                                    }}></div>
                                                </div>
                                            </Box>

                                            {/* Pasek postępu dla Medium Challenges */}
                                            <Box sx={{marginTop: 3}}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 2
                                                }}>
                                                    <Typography variant='body1'>{`Medium`}</Typography>
                                                    <Typography
                                                        variant='body1'>{`${userData.solvedMediumChallenges}/${userData.totalMediumChallenges}`}</Typography>
                                                </Box>
                                                <div className='progress-bar'>
                                                    <div className='progress-fill' style={{
                                                        width: `${calculatePercentage(userData.solvedMediumChallenges, userData.totalMediumChallenges)}%`,
                                                        backgroundColor: theme.palette.primary.main
                                                    }}></div>
                                                </div>
                                            </Box>

                                            {/* Pasek postępu dla Hard Challenges */}
                                            <Box sx={{marginTop: 3}}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 2
                                                }}>
                                                    <Typography variant='body1'>{`Hard`}</Typography>
                                                    <Typography
                                                        variant='body1'>{`${userData.solvedHardChallenges}/${userData.totalHardChallenges}`}</Typography>
                                                </Box>
                                                <div className='progress-bar'>
                                                    <div className='progress-fill' style={{
                                                        width: `${calculatePercentage(userData.solvedHardChallenges, userData.totalHardChallenges)}%`,
                                                        backgroundColor: theme.palette.primary.main
                                                    }}></div>
                                                </div>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}

                    {/* Zakładka "Your Challenges" */}
                    {isChallengesTabActive && (
                        <Grid item xs={12} md={12}>
                            {hasUserCreatedChallenges ? (
                                <Challenges allChallengesData={userCreatedChallenges}
                                            currentUserData={currentUserData}/>
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    height: '100%'
                                }}>
                                    <Typography variant='h6' sx={{mt: 2}}>
                                        No challenges
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
}
