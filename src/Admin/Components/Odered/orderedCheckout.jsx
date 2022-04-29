import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ContextGlobal } from './../../../app/ContextGlobal/index';
import XToolbar from './../../../Components/x-toolbar/XToolbar';
import Enumeration from './../../../utils/enum';
import { exportTimeSheet } from './export';

const useStyles = makeStyles((theme) => ({
	root: { height: '100%' },
	table: {
		minWidth: 650,
	},
	flex: { display: 'flex' },
	flexbetween: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(2, 0),
	},
	originalPric: {
		color: theme.palette.grey[600],
	},
	promotion: {
		marginLeft: theme.spacing(2),
	},
	padding: {
		padding: theme.spacing(2),
	},
	button: {
		cursor: 'pointer',
		margin: theme.spacing(0, 1),
	},
	input: {
		border: 'none',
		background: 'transparent',
		width: '35px',
		textAlign: 'center',
		fontSize: ' 13px',
		appearance: 'none',
		margin: '0px',
		height: '30px',
		borderTop: '1px solid rgb(200, 200, 200)',
		borderBottom: '1px solid rgb(200, 200, 200)',
		padding: ' 6px 12px',
	},
	img: {
		maxWidth: '130px',
	},
	spanbutton: {
		border: '1px solid rgb(200, 200, 200)',
		color: 'rgb(153, 153, 153)',
		padding: ' 6px 12px',
		cursor: 'pointer',
		height: '30px',
		width: '30px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '14px',
	},
	totalPricee: {
		color: 'rgb(254, 56, 52)',
		fontSize: '22px',
		fontWeight: '400',
		'& > nth:child(first-child)': {
			borderTop: '1px solid rgb(200, 200, 200)',
		},
	},
	leftcol: {},
	rightcol: {
		[theme.breakpoints.down('md')]: {
			marginTop: '15px',
		},
	},
}));

function OrderedCheckout({ paymentsCheckout = [], handleChangePagination, page }) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [paymentsCheckouts, setPaymentsCheckouts] = state.paymentCheckOutApi.paymentsCheckouts;
	const [selectedCustomers, setSelectedCustomers] = useState(null);
	return (
		<div>
			<Container className={classes.root} style={{ height: '100%' }}>
				<XToolbar
					left={() => (
						<>
							<Typography variant="h6" component="h4" >
								Quản lý đơn hàng
							</Typography>
							<Typography variant="h6" component="span" >
								Số đơn hàng({paymentsCheckouts.result})
							</Typography>
						</>
					)}
					right={() => (
						<Button
							icon="pi pi-file-excel"
							label="Tải thống kê báo cáo"
							onClick={() => exportTimeSheet(paymentsCheckout)}
						></Button>
					)}
				></XToolbar>
				<DataTable
					value={paymentsCheckout}
					responsiveLayout="scroll"
					className="p-datatable-customers"
					dataKey="_id"
					rowHover
					selection={selectedCustomers}
					onSelectionChange={(e) => setSelectedCustomers(e.value)}
					emptyMessage="No customers found."
					showGridlines
				>
					<Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

					<Column field="_id" header="Mã đơn hàng"></Column>
					<Column
						field="createdAt"
						header="Ngày đặt hàng"
						body={(d) => <span>{new Date(d.createdAt).toLocaleDateString()}</span>}
					></Column>
					<Column
						body={(d) => <span>{Enumeration.states.find((item) => item.code === d.state)?.name}</span>}
						header="Trạng thái"
					></Column>
					<Column
						body={(d) => (
							<Link to={`orderdCheckout/${d._id}`}>
								<Button label="Xem" color="primary" variant="contained"></Button>
							</Link>
						)}
						header="Xem"
					></Column>
				</DataTable>
				<Box style={{ display: 'flex', justifyContent: 'flex-end', margin: '15px 15px 0 0' }}>
					<Pagination
						count={Math.ceil(paymentsCheckouts.result / 9)}
						page={page}
						onChange={(e, value) => handleChangePagination(value)}
						variant="outlined"
						color="primary"
					/>
				</Box>
			</Container>
		</div>
	);
}

export default OrderedCheckout;
