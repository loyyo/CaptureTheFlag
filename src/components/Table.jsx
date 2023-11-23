import React from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import {
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	Avatar,
	IconButton,
	Box,
} from '@mui/material';
import {
	FirstPage as FirstPageIcon,
	KeyboardArrowLeft,
	KeyboardArrowRight,
	LastPage as LastPageIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function TablePaginationActions(props) {
	const theme = useTheme();
	const { count, page, rowsPerPage, onPageChange } = props;

	const handleFirstPageButtonClick = (event) => {
		onPageChange(event, 0);
	};

	const handleBackButtonClick = (event) => {
		onPageChange(event, page - 1);
	};

	const handleNextButtonClick = (event) => {
		onPageChange(event, page + 1);
	};

	const handleLastPageButtonClick = (event) => {
		onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
	};

	return (
		<Box
			sx={{
				flexShrink: 0,
				marginLeft: theme.spacing(2.5),
			}}
		>
			<IconButton
				onClick={handleFirstPageButtonClick}
				disabled={page === 0}
				aria-label='first page'
			>
				{theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
			</IconButton>
			<IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label='previous page'>
				{theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
			</IconButton>
			<IconButton
				onClick={handleNextButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label='next page'
			>
				{theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
			</IconButton>
			<IconButton
				onClick={handleLastPageButtonClick}
				disabled={page >= Math.ceil(count / rowsPerPage) - 1}
				aria-label='last page'
			>
				{theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
			</IconButton>
		</Box>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

export default function StickyHeadTable({ allUsersData }) {
	const theme = useTheme();
	const navigate = useNavigate();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const columns = [
		{
			id: 'rank',
			label: '#Rank',
			minWidth: 75,
			align: 'center',
			format: (value) => value.toLocaleString('en-US'),
		},
		{ id: 'avatar', align: 'center', minWidth: 75 },
		{ id: 'username', label: 'Username', align: 'left', minWidth: 175 },
		{
			id: 'points',
			label: 'Points',
			align: 'center',
			minWidth: 175,
			format: (value) => value.toLocaleString('en-US'),
		},
	];

	const rows = allUsersData;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
		<Paper sx={{ width: '100%' }}>
			<TableContainer sx={{ maxHeight: 500 }}>
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
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
							return (
								<TableRow
									hover
									type='checkbox'
									onClick={() => {
										navigate(`/profiles/${row.userID}`);
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
														sx={{ width: theme.spacing(7.5), height: theme.spacing(7.5) }}
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
						})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 50]}
				component='div'
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
				colSpan={3}
				slotProps={{
					select: {
						inputProps: { 'aria-label': 'rows per page' },
						native: true,
					},
				}}
				ActionsComponent={TablePaginationActions}
			/>
		</Paper>
	);
}

StickyHeadTable.propTypes = {
	allUsersData: PropTypes.array.isRequired,
};
