import { Button, FormGroup, FormLabel } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState } from 'react';
import { ContextGlobal } from './../../../app/ContextGlobal/index';

const useStyles = makeStyles((theme) => ({
	form: {
		textAlign: 'center',
		padding: '10px',
	},
	formgroup: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		margin: '10px 0',
		alignItems: 'center',
		width: '550px',
		display: 'flex',
	},
}));
function ChangePassword({ user = {} }) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [token] = state.token;
	const [userInfor] = state.userApi.user;
	const toast = useRef(null);

	const [valuezz, setValuezz] = useState({
		password: '',
		newpassword: '',
		comfirmnewpassword: '',
	});
	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			const res = await axios.put(
				`/user/repassword`,
				{ email: user.email, ...valuezz },
				{ headers: { authorization: token } }
			);
			showSuccess(res.data.msg);
		} catch (error) {
			alert(error.response.data.msg);
		}
	};
	const showSuccess = (title) => {
		toast.current.show({ severity: 'success', summary: 'Thành công', detail: title, life: 3000 });
	};
	const handleChange = (prop, value) => {
		const _p = { ...valuezz };
		_p[prop] = value;
		setValuezz(_p);
	};
	return (
		<div>
			<Toast ref={toast} position="bottom-right" />

			<form className={classes.form} onSubmit={handleSubmit}>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="password">
						Mật khẩu hiện tại
					</FormLabel>
					<InputText
						className="p-inputtext-sm"
						name="password"
						variant="outlined"
						onChange={(e) => handleChange('password', e.target.value)}
						value={valuezz.password}
					/>
				</FormGroup>

				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="newpassword">
						Mật khẩu mới
					</FormLabel>
					<InputText
						className="p-inputtext-sm"
						name="newpassword"
						variant="outlined"
						value={valuezz.newpassword}
						onChange={(e) => handleChange('newpassword', e.target.value)}
					/>
				</FormGroup>
				<FormGroup className={classes.formgroup}>
					<FormLabel className={classes.label} for="comfirmnewpassword">
						Xác nhận mật khẩu mới
					</FormLabel>

					<Password
						className="p-inputtext-sm"
						onChange={(e) => handleChange('comfirmnewpassword', e.target.value)}
						toggleMask
						value={valuezz.comfirmnewpassword}
					/>
				</FormGroup>

				<Button style={{ margin: 'auto' }} type="submit" variant="outlined" color="primary">
					Cập nhật
				</Button>
			</form>
		</div>
	);
}

export default ChangePassword;
