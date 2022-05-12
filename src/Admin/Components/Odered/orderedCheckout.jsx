import { Box, Container, makeStyles, Typography } from '@material-ui/core';
import Pagination from '@material-ui/lab/Pagination';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ContextGlobal } from './../../../app/ContextGlobal/index';
import XToolbar from './../../../Components/x-toolbar/XToolbar';
import Enumeration from './../../../utils/enum';
import { exportTimeSheet } from './export';
import { Calendar } from 'primereact/calendar';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { ProgressBar } from 'primereact/progressbar';
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

function OrderedCheckout({ paymentsCheckout = [], handleChangePagination, token }) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [paymentsCheckouts, setPaymentsCheckouts] = state.paymentCheckOutApi.paymentsCheckouts;
	const [selectedCustomers, setSelectedCustomers] = useState(null);
	const [filter, setfilter] = useState({ dateFrom: null, dateTo: null });
	const [payments, setPayments] = useState({});
	const [loading, setloading] = useState(false);
	const [page, setPage] = useState(1);

	useEffect(async () => {
		const _p = { ...payments };
		const _f = { ...filter };

		const res = await axios.get(`/api/paymentsCheckout?page=${page}`, {
			headers: { Authorization: token },
		});

		_p.payments = res.data.payments;
		_p.result = paymentsCheckouts.result;
		setPayments(_p);
		setfilter(_f);
	}, [page]);

	const getDataByDate = async (filter) => {
		try {
			setloading(true);
			const res = await axios.post(
				`/api/paymentsCheckout/filter`,
				{ ...filter },
				{ headers: { Authorization: token } }
			);
			if (res) {
				setPayments(res.data);
				setloading(false);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const applyChang = (prop, value) => {
		const _p = { ...filter };
		_p[prop] = value;
		setfilter(_p);
		getDataByDate(_p);
	};
	if (loading) {
		return <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>;
	}
	return (
		<div>
			<Container className="p-mt-2" style={{ height: '100%', padding: '0' }}>
				<XToolbar
					left={() => (
						<>
							<Typography variant="h6" component="span" style={{ fontSize: '16px' }}>
								Số đơn({paymentsCheckouts.result})
							</Typography>
						</>
					)}
					right={() => (
						<>
							<Dropdown
								options={Enumeration.states}
								optionLabel="name"
								optionValue="code"
								value={filter?.state}
								onChange={(e) => applyChang('state', e.value)}
								style={{ width: '150px' }}
								className="p-mr-2"
								showClear
								placeholder="Trạng thái"
							></Dropdown>
							<Calendar
								id="icon"
								value={filter?.dateFrom}
								onChange={(e) => applyChang('dateFrom', e.target.value)}
								showIcon
								style={{ height: '25px', width: '200px' }}
								placeholder="Từ ngày"
							/>
							<Calendar
								id="icon"
								value={filter?.dateTo}
								onChange={(e) => applyChang('dateTo', e.target.value)}
								showIcon
								style={{ height: '25px', width: '200px' }}
								placeholder="Đến ngày"
							/>
							<Button
								icon="pi pi-file-excel"
								label="Tải thống kê báo cáo"
								onClick={() =>
									exportTimeSheet(
										selectedCustomers?.length > 0 ? selectedCustomers : payments.payments
									)
								}
							></Button>
						</>
					)}
				></XToolbar>
				<DataTable
					value={payments.payments}
					responsiveLayout="scroll"
					className="p-datatable-customers"
					dataKey="_id"
					rowHover
					selection={selectedCustomers}
					onSelectionChange={(e) => setSelectedCustomers(e.value)}
					emptyMessage="No customers found."
					showGridlines
					style={{ height: '100%' }}
				>
					<Column selectionMode="multiple" headerStyle={{ width: '3em' }}></Column>

					<Column field="_id" header="Mã đơn hàng"></Column>
					<Column
						field="createdAt"
						header="Ngày đặt hàng"
						body={(d) => <span>{new Date(d.createdAt).toLocaleString()}</span>}
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
						onChange={(e, value) => setPage(value)}
						variant="outlined"
						color="primary"
					/>
				</Box>
			</Container>
		</div>
	);
}

export default OrderedCheckout;
