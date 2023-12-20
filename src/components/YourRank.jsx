import {useTheme} from '@mui/material/styles';
import {
    Grid,
    Typography,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';

export default function YourRank({allUsersData, currentUserData}) {
    const navigate = useNavigate();
    const theme = useTheme();

    const userRank = allUsersData.findIndex(user => user.email === currentUserData.email) + 1;

    return (
        <Grid container direction='column' alignItems='center'>
            <Typography variant='h5' sx={{ mt: 2, mb: 2 }}>
                <span style={{ marginRight: theme.spacing(2) }}>#{userRank}</span>
                <span style={{ marginRight: theme.spacing(2) }}>{currentUserData.username}</span>
                {currentUserData.points} points
            </Typography>
        </Grid>
    );
}

YourRank.propTypes = {
    allUsersData: PropTypes.array.isRequired,
    currentUserData: PropTypes.object.isRequired,
};

