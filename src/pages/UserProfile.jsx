import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext.jsx';
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
    useMediaQuery,
} from '@mui/material';
import Challenges from '../components/Challenges.jsx';
import CircularProgress from '@mui/material/CircularProgress';

export default function UserProfile() {
    const {userID} = useParams();
    const {
        getProfile,
        currentUserData,
        getUserProfile,
        thisUserData,
        allChallengesData,
        getAllChallengesData,
        getChallengeStats
    } = useAuth();
    const [activeTab, setActiveTab] = useState('informations');
    const theme = useTheme();

    const lg = useMediaQuery(theme.breakpoints.up('md'));
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const xs = useMediaQuery(theme.breakpoints.down('xs'));
    const [userData, setUserData] = useState(null);
    const userCreatedChallenges = allChallengesData.filter(challenge => thisUserData.userID === challenge.userID);

    useEffect(() => {
        if (!currentUserData) {
            getProfile();
        } else {
            setUserData(currentUserData);
        }

        async function fetchUserData() {
            if (!thisUserData || thisUserData.userID !== userID) {
                await getUserProfile(userID);
            }
            if (allChallengesData.length === 0) {
                await getAllChallengesData();
            }
            if (thisUserData && thisUserData.userID) {
                const stats = await getChallengeStats(thisUserData.userID, thisUserData.email);
                if (stats) {
                    setUserData(stats);
                }
            }
        }

        fetchUserData();
    }, [userID, thisUserData, allChallengesData, getUserProfile, getAllChallengesData, getChallengeStats]);

    if (!thisUserData || !userData || !userData.totalChallenges) {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    height: 'calc(100vh - 90px)' // Header height
                }}>
                    <Box m={10}>
                        <LinearProgress />
                    </Box>
                </Box>
            </Container>
        );
    }

    const calculatePercentage = (solved, total) => (solved / total) * 100;

    return (
        <Container component='main' maxWidth='lg' sx={{mt: 2}}>
            <CssBaseline/>
            <Paper elevation={7} sx={{padding: 2, borderRadius: '4px'}}>
                {/* Nagłówek strony i przyciski zakładek */}
                <Box p={2} borderBottom={1} borderColor='grey.300'>
                    <Typography variant='h4' align='center'>
                        Profile
                    </Typography>
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 1}}>
                        <Button
                            variant={activeTab === 'informations' ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => setActiveTab('informations')}
                            sx={{
                                width: '250px',
                                color: 'white',
                                background: activeTab === 'informations' ? theme.palette.primary.dark : theme.palette.primary.light,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            Informations
                        </Button>
                        <Button
                            variant={activeTab === 'challenges' ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => setActiveTab('challenges')}
                            sx={{
                                width: '250px',
                                ml: 2,
                                color: 'white',
                                background: activeTab === 'challenges' ? theme.palette.primary.dark : theme.palette.primary.light,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                },
                            }}
                        >
                            Challenges
                        </Button>
                    </Box>
                </Box>

                <Grid>
                    {activeTab === 'informations' && (
                        <Grid container spacing={1} alignItems="stretch">
                            {/* Avatar, bio i opis */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{p: 2, height: '100%'}}>
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
                                                    src={thisUserData.avatar}
                                                    sx={{width: '100px', height: '100px', mr: 2}}
                                                />
                                                <Box>
                                                    <Typography variant='h5'>{thisUserData.username}</Typography>
                                                    <Typography
                                                        variant='body1'>Rank: {userData.ranking}</Typography>
                                                    <Typography
                                                        variant='body1'>Points: {thisUserData.points}</Typography>
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
                                            <Typography variant='body1'>{thisUserData.bio}</Typography>
                                        </Paper>

                                        {currentUserData.userID === thisUserData.userID && (
                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={() => navigate('/profile/settings')}
                                            sx={{width: '95%'}}
                                        >
                                            Edit Profile
                                        </Button>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>


                            {/* Solved challenges */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{p: 2, height: '100%', mb: 2}}>
                                    <Typography variant='h6' gutterBottom>
                                        Solved Challenges
                                    </Typography>

                                    <Grid container spacing={2} alignItems="center">
                                        {/* Koło z ilością wykonanych wyzwań */}
                                        <Grid item>
                                            <Box sx={{
                                                position: 'relative',
                                                display: 'inline-flex',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={100}
                                                    size={100}
                                                    thickness={4}
                                                    sx={{color: theme.palette.primary.light}}
                                                />
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={calculatePercentage(userData.solvedChallenges, userData.totalChallenges)}
                                                    size={100}
                                                    thickness={4}
                                                    sx={{position: 'absolute', color: theme.palette.primary.dark}}
                                                />
                                                <Box
                                                    sx={{
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
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
                                        <Grid item xs>

                                            {/*może ten?*/}
                                            {/*<Box sx={{ width: 'calc(100% - 120px)' }}> */}
                                            {/*    <Box sx={{ mb: 1 }}>*/}
                                            {/*        <Typography variant='body2'>{`Easy Challenges: ${userData.solvedEasyChallenges}/${userData.totalEasyChallenges}`}</Typography>*/}
                                            {/*        <LinearProgress variant='determinate' value={calculatePercentage(userData.solvedEasyChallenges, userData.totalEasyChallenges)} />*/}
                                            {/*    </Box>*/}
                                            {/*</Box>*/}

                                            <Box>
                                                {/* Pasek postępu dla Easy Challenges */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 1
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
                                            <Box sx={{marginTop: 2}}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 1
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
                                            <Box sx={{marginTop: 2}}>
                                                <Box sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    marginBottom: 1
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
                    {activeTab === 'challenges' && (
                        <Grid item xs={12} md={12}>
                            <Challenges allChallengesData={userCreatedChallenges} currentUserData={currentUserData}/>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
}