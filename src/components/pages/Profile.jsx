import React, {useEffect, useState} from 'react';
import {useTheme} from '@mui/material/styles';
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
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Checkbox,
    LinearProgress,
    Button,
    useMediaQuery,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../contexts/AuthContext.jsx';
import Challenges from '../Challenges.jsx';

export default function Profile() {
    const navigate = useNavigate();
    const {getProfile, currentUserData, allChallengesData, getAllChallengesData, getChallengeStats} = useAuth();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('informations');

    const lg = useMediaQuery(theme.breakpoints.up('md'));
    const md = useMediaQuery(theme.breakpoints.down('md'));
    const xs = useMediaQuery(theme.breakpoints.down('xs'));
    const [userData, setUserData] = useState(null);
    const [challengesData, setChallengesData] = useState([]);
    const userCreatedChallenges = allChallengesData.filter(challenge => currentUserData.userID === challenge.userID);

    useEffect(() => {
        if (!currentUserData) {
            getProfile();
        } else {
            setUserData(currentUserData);
        }

        if (allChallengesData.length === 0) {
            getAllChallengesData();
        } else {
            setChallengesData(allChallengesData);
        }

        if (currentUserData && currentUserData.userID) {
            getChallengeStats(currentUserData.userID).then(stats => {
                setUserData(prevState => ({...prevState, ...stats}));
            });
        }
    }, [currentUserData, allChallengesData, getProfile, getAllChallengesData, getChallengeStats]);


    const primaryColors = 1
        ? {
            light: '#3f4fa3',
            main: '#2c387e',
            dark: '#212c6f',
        }
        : {
            light: '#7986cb',
            main: '#3f51b5',
            dark: '#303f9f',
        };


    if (!userData) {
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
            <Container component='main' maxWidth='lg'>
                <CssBaseline/>
                <Box sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <Typography variant='h4'>Loading...</Typography>
                </Box>
            </Container>
        );
    }

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
                        >
                            Informations
                        </Button>
                        <Button
                            variant={activeTab === 'challenges' ? 'contained' : 'outlined'}
                            color='primary'
                            onClick={() => setActiveTab('challenges')}
                            sx={{ml: 2}}
                        >
                            Your Challenges
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
                                               sx={{p: 2, mb: 2, width: '95%', bgcolor: 'background.paper'}}>
                                            <Box display='flex' flexDirection='row' alignItems='center'
                                                 sx={{width: '100%', justifyContent: 'center'}}>
                                                <Avatar
                                                    variant='rounded'
                                                    alt='Profile Avatar'
                                                    src={currentUserData.avatar}
                                                    sx={{width: '100px', height: '100px', mr: 2}}
                                                />
                                                <Box>
                                                    <Typography variant='h6'>{userData.username}</Typography>
                                                    <Typography variant='body1'>Rank: {userData.ranking}</Typography>
                                                    <Typography variant='body1'>Points: {userData.points}</Typography>
                                                </Box>
                                            </Box>
                                        </Paper>

                                        {/* Otoczka tylko dla bio */}
                                        <Paper elevation={1}
                                               sx={{p: 2, mb: 2, width: '95%', bgcolor: 'background.paper'}}>
                                            <Typography variant='body1'>{userData.bio}</Typography>
                                        </Paper>

                                        <Button
                                            variant='contained'
                                            color='primary'
                                            onClick={() => navigate('/profile/settings')}
                                            sx={{width: '95%'}}
                                        >
                                            Edit Profile
                                        </Button>
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
                                            <div
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '50%',
                                                    border: `4px solid ${primaryColors.main}`,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '24px',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                {userData.solvedChallenges}
                                                <div style={{fontSize: '12px'}}>Solved</div>
                                            </div>
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
                                                        backgroundColor: primaryColors.main
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
                                                        backgroundColor: primaryColors.main
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
                                                        backgroundColor: primaryColors.main
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
