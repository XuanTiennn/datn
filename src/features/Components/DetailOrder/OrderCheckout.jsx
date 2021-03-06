import { Container, makeStyles, Paper, Typography } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal';
import formatNumber from '../../../utils/formatNumber';
import Enumeration from './../../../utils/enum';
import axios from 'axios';
import { Toast } from 'primereact/toast';
const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2, 0),
		marginTop: '100px',
	},

	img: {
		maxWidth: '100px',
	},
}));
function OrderCheckoutDetails({ payments = [] }) {
	const classes = useStyles();
	const params = useParams();
	const state = useContext(ContextGlobal);
	const [paymentsCheckout, setPaymentsCheckout] = state.paymentCheckOutApi.paymentsCheckout;

	const [orderDetails, setOrderDetails] = useState([]);
	const [reason, setReason] = useState();
	const [token] = state.token;
	const toast = useRef();
	useEffect(() => {
		if (params.id) {
			paymentsCheckout.forEach((item) => {
				if (item._id === params.id) {
					setOrderDetails(item);
				}
			});
		}
	}, [params.id]);
	const changeState = async (state) => {
		let res;
		try {
			res = await axios.put(
				`/api/paymentsCheckout/${orderDetails._id}`,
				{ ...orderDetails, state, reason },
				{ headers: { Authorization: token } }
			);

			const _arr = [...paymentsCheckout];
			for (let i = 0; i < _arr.length; i++) {
				if (_arr[i]._id === orderDetails._id) {
					_arr[i] = res.data;
				}
			}
			setOrderDetails(res.data)
			setPaymentsCheckout(_arr);
			showWarning();
		} catch (error) {
			console.log(error);
		}
	};
	const showWarning = () => {
		toast.current.show({
			severity: 'success',
			summary: 'Thao t??c th??nh c??ng',

			life: 3000,
		});
	};
	if (orderDetails.length === 0) return null;
	return (
		<Container className={classes.root}>
			<TableContainer component={Paper}>
				<Typography style={{ margin: '10px' }} component="h2" variant="h5">
					Th??ng tin kh??ch h??ng
				</Typography>
				<Toast ref={toast} />
				<Table className={classes.table} aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>T??n</TableCell>
							<TableCell align="center">?????a ch???</TableCell>
							<TableCell align="center">H??nh th???c giao h??ng</TableCell>
							<TableCell align="center">S??? ??i???n tho???i</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<TableRow>
							<TableCell component="th" scope="row">
								{orderDetails.name}
							</TableCell>
							<TableCell align="center">{orderDetails.address}</TableCell>
							<TableCell align="center">
								{orderDetails.derivery === 'tietkiem' ? 'Ti???t ki???m' : 'Si??u t???c'}
							</TableCell>
							<TableCell align="center">{orderDetails.phone}</TableCell>
						</TableRow>
					</TableBody>
				</Table>
				<Typography style={{ margin: '20px 10px' }} component="h2" variant="h5">
					Th??ng tin s???n ph???m
				</Typography>

				<Table style={{ margin: '30px 0px' }}>
					<TableHead>
						<TableCell>H??nh ???nh s???n ph???m</TableCell>
						<TableCell align="center">T??n s???n ph???m</TableCell>
						<TableCell align="center">Lo???i s???n ph???m</TableCell>
						<TableCell align="center">S??? l?????ng</TableCell>
						<TableCell align="center">Gi??</TableCell>
					</TableHead>
					<TableBody>
						{orderDetails.cart.map((item) => (
							<TableRow key={item._id}>
								<TableCell>
									<img className={classes.img} src={item.images.url} alt="" />
								</TableCell>
								<TableCell align="center">{item.title}</TableCell>
								<TableCell align="center">{item.category}</TableCell>
								<TableCell align="center">{item.quantity}</TableCell>
								<TableCell align="center">{formatNumber(item.price * item.quantity)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{orderDetails.state === Enumeration.INIT && (
					<div style={{display:'flex',marginLeft:'20px'}}>
						<button
							onClick={() => changeState(Enumeration.CANCEL)}
							style={{
								padding: '5px',
								backgroundColor: 'white',
								color: 'red',
								border: '1px solid red',
								borderRadius: '5px',
								marginRight:'10px'
							}}
						>
							H???y ????n h??ng
						</button>
						<textarea placeholder="L?? do" onChange={(e) => setReason(e.target.value)}></textarea>
					</div>
				)}
			</TableContainer>
		</Container>
	);
}

export default OrderCheckoutDetails;
