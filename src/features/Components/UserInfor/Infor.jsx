import { Button, FormGroup, FormLabel, makeStyles, TextField } from '@material-ui/core';
import axios from 'axios';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState } from 'react';
import { ContextGlobal } from './../../../app/ContextGlobal/index';
Infor.propTypes = {};
const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '400px',
		padding: '30px',
	},
	formgroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: '10px 0',
		alignItems: 'center',
		width: '100%',
	},
	label: {},
	inputaaazz21: {},
}));
function Infor({ user = {} }) {
	// console.log(user);
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [token] = state.token;
	const [userInfor] = state.userApi.user;
	const [getValue, setgetValue] = useState({
		name: userInfor?.name,
		address: userInfor?.address,
		gender: userInfor?.gender,
		phone: userInfor?.phone,
		birthday: userInfor?.birthday,
		state: true,
	});
	const handleSubmit = async () => {
		try {
			const res = await axios.put(
				`/user/update/${user._id}`,
				{ ...getValue },
				{ headers: { authorization: token } }
			);

			showSuccess(res.data.msg);
		} catch (error) {
			console.log(error);
		}
	};
	const toast = useRef(null);

	const handleChange = (prop, value) => {
		const _p = { ...getValue };
		_p[prop] = value;
		setgetValue(_p);
	};
	const showSuccess = (title) => {
		toast.current.show({ severity: 'success', summary: 'Thành công', detail: title, life: 3000 });
	};
	console.log(getValue);
	return (
		<div>
			<Toast ref={toast} position="bottom-right" />
			<div className={classes.form}>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="name">
						Họ tên
					</FormLabel>
					<InputText
						className="p-inputtext-sm"
						name="name"
						variant="outlined"
						value={getValue.name}
						onChange={(e) => handleChange('name', e.target.value)}
					/>
				</FormGroup>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="email">
						Email
					</FormLabel>
					<InputText className="p-inputtext-sm" name="email" variant="outlined" disabled value={user.email} />
				</FormGroup>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="address">
						Địa chỉ
					</FormLabel>
					<InputText
						className="p-inputtext-sm"
						name="address"
						variant="outlined"
						value={getValue.address === '' ? user.address : getValue.address}
						onChange={(e) => handleChange('address', e.target.value)}
					/>
				</FormGroup>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="email">
						Số điện thoại
					</FormLabel>
					<InputText
						className="p-inputtext-sm"
						name="phone"
						variant="outlined"
						value={getValue.phone === '' ? user.phone : getValue.phone}
						onChange={(e) => handleChange('phone', e.target.value)}
					/>
				</FormGroup>
				<FormGroup style={{ width: '100%', display: 'flex' }} className={classes.formgroup}>
					<FormLabel className={classes.label} component="legend">
						Giới tính
					</FormLabel>
					<Dropdown
						options={[
							{ code: 'male', name: 'Nam' },
							{ code: 'female', name: 'Nữ' },
						]}
						optionValue="code"
						optionLabel="name"
						onChange={(e) => handleChange('gender', e.target.value)}
						style={{ width: '185px' }}
						value={getValue.gender}
						className="p-inputtext-sm"
					/>
				</FormGroup>
				<TextField
					id="date"
					label="Ngày sinh"
					type="date"
					name="birthday"
					value={getValue.birthday === '' ? user.birthday : getValue.birthday}
					onChange={(e) => handleChange('birthday', e.target.value)}
					className={classes.textField}
					InputLabelProps={{
						shrink: true,
					}}
				/>
				<Button type="submit" variant="outlined" color="primary" onClick={handleSubmit}>
					Cập nhật
				</Button>
			</div>
		</div>
	);
}

export default Infor;
