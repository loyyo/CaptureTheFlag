import {useState, useEffect} from 'react';
import {useTheme, useMediaQuery} from '@mui/material'; // Corrected import
import {Typography, Button, IconButton, AppBar, Toolbar, MenuItem, Menu, Box} from '@mui/material';
import {AccountCircle, Flag as FlagIcon, Equalizer as EqualizerIcon, Add as AddIcon} from '@mui/icons-material';
import {useAuth} from '../contexts/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';
import {useLocation} from 'react-router-dom'; // import useLocation

const Header = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Correctly using useMediaQuery
    const [anchorEl, setAnchorEl] = useState(null);
    const {darkMode, switchDarkMode, currentUser, logout} = useAuth();
    const location = useLocation(); // Get the current location
    const [currentPage, setCurrentPage] = useState('');

    const isMenuOpen = Boolean(anchorEl);

    const handleLogout = async () => {
        try {
            await logout();
            navigate(0);
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    const navigateTo = (path) => {
        handleCloseMenu();
        navigate(path);
    };

    const activeButtonStyle = {
        color: theme.palette.primary.dark,
        backgroundColor: 'white',
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    };

    const handleOpenMenu = (event) => setAnchorEl(event.currentTarget);
    const handleCloseMenu = () => setAnchorEl(null);

    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [location]);

    const renderMenuItems = () => {
        const items = currentUser === null ? [
            <MenuItem key="login" onClick={() => navigateTo('/login')}>Login</MenuItem>,
            <MenuItem key="register" onClick={() => navigateTo('/register')}>Sign Up</MenuItem>
        ] : [
            <MenuItem key="profile" onClick={() => navigateTo('/profile')}>Profile</MenuItem>,
            <MenuItem key="settings" onClick={() => navigateTo('/profile/settings')}>Settings</MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>,
        ];

        items.push(
            <MenuItem key="mode"
                      onClick={switchDarkMode}>{darkMode === 'true' ? 'Light Mode' : 'Dark Mode'}</MenuItem>
        );

        return items;
    };
    const isActive = (path) => currentPage === path;


    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar color="primary" position="fixed">
                <Toolbar>
                    {/* Brainplex Logo/Button */}
                    <Button onClick={() => navigateTo('/challenges')}>
                        <Typography variant="subtitle2" sx={{color: 'white', '&:hover': {textDecoration: 'none'}}}>
                            Brainplex
                        </Typography>
                    </Button>

                    {/* Center Links for Desktop View */}
                    {!isMobile && currentUser && (
                        <Box sx={{flexGrow: 1, display: 'flex', justifyContent: 'center'}}>
                            <Button
                                onClick={() => navigateTo('/challenges')}
                                sx={{
                                    ...isActive('/challenges') ? activeButtonStyle : {color: 'white'},
                                    mx: 2
                                }}
                            >
                                Challenges
                            </Button>
                            <Button
                                onClick={() => navigateTo('/challenge/add')}
                                sx={{
                                    ...isActive('/challenge/add') ? activeButtonStyle : {color: 'white'},
                                    mx: 2
                                }}
                            >
                                Create
                            </Button>
                            <Button
                                onClick={() => navigateTo('/leaderboard')}
                                sx={{
                                    ...isActive('/leaderboard') ? activeButtonStyle : {color: 'white'},
                                    mx: 2
                                }}
                            >
                                Leaderboard
                            </Button>
                            <Button
                                onClick={() => navigateTo('/chat')}
                                sx={{
                                    ...isActive('/chat') ? activeButtonStyle : {color: 'white'},
                                    mx: 2
                                }}
                            >
                                Chat
                            </Button>
                        </Box>
                    )}

                    {/* Profile Icon/Button, always on the right */}
                    <Box sx={{marginLeft: 'auto'}}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenMenu}
                            color="inherit"
                        >
                            <AccountCircle sx={{color: 'white'}}/>
                        </IconButton>
                    </Box>

                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                        keepMounted
                        transformOrigin={{vertical: 'top', horizontal: 'right'}}
                        open={isMenuOpen}
                        onClose={handleCloseMenu}
                    >
                        {renderMenuItems()}
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box sx={{mt: '90px'}}></Box>
        </Box>
    );
};

export default Header;
