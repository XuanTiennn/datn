import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import Enumeration from './../../../../utils/enum';
import StepThree from './stepThree';
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
	const [payload, setPayload] = useState({
		name: userInfor?.name,
		phone: userInfor?.phone,
		address: userInfor?.address,
		derivery: 'tietkiem',
	});
	const [show, setshow] = useState(false);
	const toast = useRef();
	const addToCart = async (cart) => {
		await axios.patch('/user/addcart', { cart }, { headers: { Authorization: token } });
	};
	console.log(userInfor);
	useImperativeHandle(ref, () => ({
		show: () => {
			setshow(true);
		},
	}));
	const handleCreatePayment = async () => {
		const _payload = { ...payload };
		let error = false;

		if (_payload.phone == undefined || _payload.phone?.length === 0) {
			error = true;
			showSuccess('Số điện thoại không được để trống');
		} else if (_payload.address == undefined || _payload.address?.length === 0) {
			error = true;
			showSuccess('Địa chỉ không được để trống');
		}

		if (!error) {
			const res = await axios.post(
				'/api/paymentsCheckout',
				{ cart, ...payload, state: Enumeration.INIT },
				{ headers: { Authorization: token } }
			);
			alert(res.data.mgs);
			setCart([]);
			addToCart([]);
			window.location.href = '/';
			await axios.post('/api/notiUser', { userInfor, cart });
		}
	};
	const applyChange = (prop, value) => {
		const _payload = { ...payload };
		_payload[prop] = value;
		if (_payload.phone?.length === 0) {
			showSuccess('Số điện thoại không được để trống');
		} else if (_payload.address?.length === 0) {
			showSuccess('Địa chỉ không được để trống');
		}
		setPayload(_payload);
	};
	const showSuccess = (title) => {
		toast.current.show({ severity: 'warn', summary: 'Lỗi', detail: title, life: 3000 });
	};
	return (
		<XLayout className="p-p-2" style={{ backgroundColor: '#ececec', marginTop: '150px' }}>
			<Toast ref={toast} position="bottom-right" />

			<XLayout_Center style={{ backgroundColor: 'white' }}>
				<div className="p-col-12" style={{ display: 'flex' }}>
					<div className="p-col-5" style={{ display: 'flex' }}>
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
								<p style={{ fontSize: '18px' }}>Tên người nhận hàng</p>

								<InputText
									value={payload.name}
									onChange={(e) => applyChange('name', e.target.value)}
									placeholder="Tên người nhận hàng"
								/>
								<p style={{ fontSize: '18px' }}>Số điện thoại</p>

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
