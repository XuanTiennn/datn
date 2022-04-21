import { Container, Grid } from '@material-ui/core';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useContext, useState,useImperativeHandle } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import StepOne from './stepOne';
import StepThree from './stepThree';
import StepTwo from './stepTwo';
CheckoutPayment.propTypes = {};
const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
	},
	button: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

function getSteps() {
	return ['Chọn hình thức giao hàng', 'Địa chỉ giao hàng', 'Phương thức thanh toán'];
}

function CheckoutPayment(props, ref) {
	const classes = useStyles();
	const steps = getSteps();
	const state = useContext(ContextGlobal);
	const [userInfor] = state.userApi.user;
	const [token] = state.token;
	const [cart, setCart] = state.userApi.cart;
	const [derivery, setDerivery] = useState('');
	const [address, setAddress] = useState('');
	const [phone, setPhone] = useState('');
	const [show, setshow] = useState(false);
	const addToCart = async (cart) => {
		await axios.patch('/user/addcart', { cart }, { headers: { Authorization: token } });
	};
	// console.log(cart, derivery, address, phone);
	console.log(cart);
	useImperativeHandle(ref, () => ({
		show: () => {
			setshow(true);
		},
	}));
	const handleCreatePayment = async () => {
		const res = await axios.post(
			'/api/paymentsCheckout',
			{ cart, derivery, address, phone },
			{ headers: { Authorization: token } }
		);
		// console.log(res);
		await axios.post('/api/notiUser', { userInfor, cart });

		setCart([]);
		addToCart([]);
		alert(res.data.mgs);
		window.location.href = '/';
	};
	const onHide = () => {
		setshow(false);
	};
	return (
		<Dialog visible={show} onHide={onHide} style={{width:'60vw'}}>
			<Container className={classes.root}>
				
				<Grid container style={{ marginTop: '20px' }}>
					<Grid item lg={12}>
						<Grid container style={{ justifyContent: 'space-between', alignItems: 'stretch' }}>
							<Grid item lg={4}>
								<StepOne handleChange={(derivery) => setDerivery(derivery)} />
							</Grid>
							<Grid item lg={4}>
								<StepTwo
									address={address}
									phone={phone}
									handleChangeAddress={(address) => setAddress(address)}
									handleChangePhone={(phone) => setPhone(phone)}
								/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item lg={12}>
						<StepThree cart={cart} handleChange={handleCreatePayment} />
					</Grid>
				</Grid>
			</Container>
		</Dialog>
	);
}

export default forwardRef(CheckoutPayment);
