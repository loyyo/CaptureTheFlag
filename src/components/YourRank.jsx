import { useTheme } from '@mui/material/styles';
import {
	Grid,
	Typography,
	Button,
	Paper,
	Avatar,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function YourRank({ allUsersData, currentUserData }) {
	const navigate = useNavigate();
	const theme = useTheme();

	const columns = [
		{
			id: 'rank',
			label: '#Rank',
			minWidth: 50,
			align: 'center',
			format: (value) => value.toLocaleString('en-US'),
		},
		{ id: 'avatar', align: 'center', minWidth: 50 },
		{ id: 'username', label: 'Username', align: 'left', minWidth: 150 },
		{
			id: 'points',
			label: 'Points',
			align: 'center',
			minWidth: 75,
			format: (value) => value.toLocaleString('en-US'),
		},
	];

	return (
		<Paper sx={{ width: '100%' }}>
			<Grid container direction='column' alignItems='center'>
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table stickyHeader aria-label='sticky table'>
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{allUsersData.map((row, index) => {
								if (row['email'] === currentUserData.email) {
									return (
										<TableRow
											hover
											type='checkbox'
											onClick={() => {
												navigate('/profile');
											}}
											tabIndex={-1}
											key={row.userID}
										>
											{columns.map((column) => {
												const value = row[column.id];
												if (column.id === 'rank') {
													return (
														<TableCell key={column.id} align={column.align}>
															{index + 1}
														</TableCell>
													);
												}
												if (column.id === 'avatar') {
													return (
														<TableCell key={column.id} align={column.align}>
															<Avatar
																variant='rounded'
																alt='default_avatar'
																src={value}
																sizes='150px 150px'
																sx={{ width: theme.spacing(5), height: theme.spacing(5) }}
																style={{ padding: '0.5rem' }}
															/>
														</TableCell>
													);
												} else {
													return (
														<TableCell key={column.id} align={column.align}>
															{column.format && typeof value === 'number'
																? column.format(value)
																: value}
														</TableCell>
													);
												}
											})}
										</TableRow>
									);
								} else {
									return null;
								}
							})}
						</TableBody>
					</Table>
				</TableContainer>
				{currentUserData.points === 0 && (
					<div style={{ width: '100%' }}>
						<Typography variant='h5' className='header-text-dark' gutterBottom>
							You need to complete your first challenge!
						</Typography>
					</div>
				)}
				<Grid item style={{ width: '100%' }}>
					<Button
						style={{ textDecoration: 'none' }}
						onClick={() => {
							navigate('/challenges');
						}}
						color='primary'
						variant='contained'
						sx={{
							width: '100%',
							height: theme.spacing(6),
							fontSize: theme.spacing(2),
							background: theme.palette.primary.light,
						}}
					>
						GET MORE POINTS!
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}

YourRank.propTypes = {
	allUsersData: PropTypes.array.isRequired,
	currentUserData: PropTypes.object.isRequired,
};
