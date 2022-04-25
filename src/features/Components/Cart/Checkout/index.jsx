import { Container, Grid, RadioGroup, FormControl, Radio, FormControlLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import React, { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import StepThree from './stepThree';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import Enumeration from './../../../../utils/enum';
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
	const [payload, setPayload] = useState({ phone: '', address: '', derivery: 'tietkiem' });
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
			{ cart, ...payload, state: Enumeration.INIT },
			{ headers: { Authorization: token } }
		);
		// console.log(res);
		await axios.post('/api/notiUser', { userInfor, cart });

		setCart([]);
		addToCart([]);
		alert(res.data.mgs);
		window.location.href = '/';
	};
	const applyChange = (prop, value) => {
		const _payload = { ...payload };
		_payload[prop] = value;
		setPayload(_payload);
	};
	return (
		<XLayout className="p-p-2" style={{ backgroundColor: '#ececec' }}>
			<XLayout_Center style={{ backgroundColor: 'white' }}>
				<div className="p-col-12" style={{ display: 'flex' }}>
					<div className="p-col-5">
						<div>
							<p style={{ fontSize: '18px' }}>Hình thức giao hàng</p>
							<FormControl component="fieldset">
								<RadioGroup name="giaohang" onChange={(e) => applyChange('derivery', e.target.value)}>
									<FormControlLabel
										value="tietkiem"
										control={<Radio checked />}
										label="Giao hàng tiêu chuẩn"
									/>
								</RadioGroup>
							</FormControl>
						</div>
						<div>
							<p style={{ fontSize: '18px' }}>Địa chỉ giao hàng</p>
							<div>
								<InputText
									value={payload.address}
									onChange={(e) => applyChange('address', e.target.value)}
									placeholder="Địa chỉ nhận hàng"
								/>
								<InputText
									value={payload.phone}
									onChange={(e) => applyChange('phone', e.target.value)}
									placeholder="Số điện thoại"
								/>
							</div>
							<p>Ghi chú cho đơn hàng</p>
							<InputTextarea rows={2} />
						</div>
					</div>
					<div className="p-col-7">
						<p>Thông tin đơn hàng</p>
						<Grid item lg={12}>
							<StepThree cart={cart} handleChange={handleCreatePayment} />
						</Grid>
					</div>
				</div>
			</XLayout_Center>
		</XLayout>
	);
}

export default forwardRef(CheckoutPayment);
