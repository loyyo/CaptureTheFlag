import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
    CssBaseline,
    Paper,
    Container,
    Divider,
    Grid,
    Avatar,
    Typography,
    Button,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Profile() {
    const navigate = useNavigate();
    const { currentUserData } = useAuth();
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState('informations');

    const [userData, setUserData] = useState(null);
    const [challengesData, setChallengesData] = useState([]);

    useEffect(() => {
        // W rzeczywistym projekcie te dane pochodziłyby z API lub bazy danych
        const mockUserData = {
            avatar: 'https://example.com/avatar.jpg',
            username: 'JohnDoe',
            points: 250,
            ranking: 5,
            bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            solvedChallenges: 35,
            solvedEasyChallenges: 12,
            solvedMediumChallenges: 18,
            solvedHardChallenges: 5,
            totalEasyChallenges: 30,
            totalMediumChallenges: 40,
            totalHardChallenges: 20,
        };

        const mockChallengesData = [
            { title: 'Challenge 1', category: 'Easy', completed: true },
            { title: 'Challenge 2', category: 'Medium', completed: true },
            { title: 'Challenge 3', category: 'Hard', completed: false },
            { title: 'Challenge 4', category: 'Easy', completed: false },
            // Dodaj więcej wyzwań w podobnym formacie
        ];

        // Ustaw dane w stanie komponentu
        setUserData(mockUserData);
        setChallengesData(mockChallengesData);
    }, []);

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
                <CssBaseline />
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

    return (
        <Container maxWidth='lg'>
            <CssBaseline />
            <Paper elevation={7}>
                {/* Nagłówek strony */}
                <Box p={2} borderBottom={1} borderColor='grey.300'>
                    <Typography variant='h5' align='center'>
                        Profile
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
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
                            sx={{ ml: 2 }}
                        >
                            Your Challenges
                        </Button>
                    </Box>
                </Box>

                <Grid container spacing={3}>
                    {activeTab === 'informations' && (
                        <>
                            {/* Avatar i opis */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar variant='rounded' alt='Profile Avatar' src={userData.avatar} sx={{ width: '100px', height: '100px', mb: 2 }} />
                                    <Typography variant='h6'>{userData.username}</Typography>
                                    <Typography variant='body1'>Points: {userData.points}</Typography>
                                    <Typography variant='body1'>Ranking: {userData.ranking}</Typography>
                                    <Typography variant='body1'>Bio: {userData.bio}</Typography>
                                </Paper>
                            </Grid>

                            {/* Solved challenges */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={3} sx={{ p: 2 }}>
                                    <Typography variant='h6' gutterBottom>
                                        Solved Challenges
                                    </Typography>
                                    {/* Okrągła ramka z ilością wykonanych wyzwań i napisem "Solved" */}
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
                                            marginBottom: '16px',
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {userData.solvedChallenges}
                                        <div style={{ fontSize: '12px' }}>Solved</div>
                                    </div>

                                    <Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                                            <Typography variant='body1'>{`Easy`}</Typography>
                                            <Typography variant='body1'>{`${userData.solvedEasyChallenges}/${userData.totalEasyChallenges}`}</Typography>
                                        </Box>
                                        <div className='progress-bar'>
                                            <div className='progress-fill' style={{ width: `${calculatePercentage(userData.solvedEasyChallenges, userData.totalEasyChallenges)}%`, backgroundColor: primaryColors.main }}></div>
                                        </div>
                                    </Box>

                                    <Box sx={{ marginTop: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                                            <Typography variant='body1'>{`Medium`}</Typography>
                                            <Typography variant='body1'>{`${userData.solvedMediumChallenges}/${userData.totalMediumChallenges}`}</Typography>
                                        </Box>
                                        <div className='progress-bar'>
                                            <div className='progress-fill' style={{ width: `${calculatePercentage(userData.solvedMediumChallenges, userData.totalMediumChallenges)}%`, backgroundColor: primaryColors.main }}></div>
                                        </div>
                                    </Box>

                                    <Box sx={{ marginTop: 2 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                                            <Typography variant='body1'>{`Hard`}</Typography>
                                            <Typography variant='body1'>{`${userData.solvedHardChallenges}/${userData.totalHardChallenges}`}</Typography>
                                        </Box>
                                        <div className='progress-bar'>
                                            <div className='progress-fill' style={{ width: `${calculatePercentage(userData.solvedHardChallenges, userData.totalHardChallenges)}%`, backgroundColor: primaryColors.main }}></div>
                                        </div>
                                    </Box>
                                </Paper>
                            </Grid>
                        </>
                    )}

                    {/* Pozostała zawartość zakładki "Your Challenges" */}
                    {activeTab === 'challenges' && (
                        // Tutaj dodaj kod do wyświetlenia wyzwań
                        // Możesz użyć podobnego podejścia do zakładki "informations"
                        // aby wyświetlić listę wyzwań użytkownika
                        // oraz jakieś dodatkowe informacje dotyczące wyzwań
                        <Grid item xs={12} md={12}>
                            {/* Własna zawartość dla zakładki "Your Challenges" */}
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Container>
    );
}
