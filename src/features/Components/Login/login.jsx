import { Backdrop, Button, Fade, makeStyles, Modal, Paper, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import axios from 'axios';
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import LoginWFB from './loginWFB';
import LoginWGG from './loginWGG';
import { Link } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Dialog } from 'primereact/dialog';
import Enumeration from 'utils/enum';

Login.propTypes = {};
const useStyles = makeStyles((theme) => ({
	modal: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		border: 'none',
	},
	paper: {
		display: 'flex',
	},
	form: {
		display: 'flex',
		flexDirection: 'column',
		padding: theme.spacing(5),
	},

	email: {
		margin: theme.spacing(2, 0),
	},
	password: { margin: theme.spacing(2, 0) },
	img: {
		maxWidth: '300px',
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
}));
function Login(props, ref) {
	const classes = useStyles();
	// const state = useContext(ContextGlobal);
	//console.log(isAdmin);
	const [show, setShow] = useState(false);
	const refMode = useRef();
	const [form, setForm] = useState({
		email: '',
		password: '',
		name: '',
	});
	const handleChange = (prop, value) => {
		const _form = { ...form };
		_form[prop] = value;
		setForm(_form);
	};
	useImperativeHandle(ref, () => ({
		login: () => {
			setShow(true);
			refMode.current = 'login';
		},
		register: () => {
			setShow(true);
			refMode.current = 'register';
		},
	}));
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			switch (refMode.current) {
				case 'login':
					await axios.post('/user/login', { ...form });
					localStorage.setItem('firstlogin', true);
					window.location.href = '/';
					break;
				case 'register':
					await axios.post('/user/register', { ...form });
					localStorage.setItem('firstlogin', true);
					window.location.href = '/';
					break;
			}
		} catch (err) {
			console.log(err);
			const failr = err.response.data.mgs;
			alert(failr);
		}
	};
	const showMessage = (title) => {
		return <Dialog></Dialog>;
	};

	return (
		<Dialog visible={show} onHide={() => setShow(false)} style={{marginTop:'80px'}}>
			{/* <Fade in={open}> */}
			<Paper className={classes.paper}>
				<form className={classes.form} onSubmit={handleSubmit}>
					{/* <Typography variant="h3" component="h2">
							Đăng nhập
						</Typography> */}
					{refMode.current === 'register' && (
						<InputText
							className={form.name?.length == 0 && 'p-invalid'}
							name="name"
							value={form.name}
							autoComplete={false}
							onChange={(e) => handleChange('name', e.target.value)}
							required
							type="name"
							placeholder="Tên"
						/>
					)}

					<InputText
						className={form.email.length == 0 && 'p-invalid'}
						name="email"
						value={form.email}
						placeholder="Email"
						onChange={(e) => handleChange('email', e.target.value)}
						required
						type="email"
						autoComplete={false}
						style={{marginTop:'10px'}}
					/>

					<Password
						autoComplete={false}
						value={form.password}
						onChange={(e) => handleChange('password', e.target.value)}
						toggleMask
						className='p-mt-2 p-mb-2'
					/>

					<div className="p-mt-3" style={{ maxWidth: '210px', overflow: 'hidden' }}>
						<Button
							type="submit"
							variant="contained"
							style={{ backgroundColor: '#48c4a1', color: 'white', width: '100%' }}
						>
							{refMode.current === 'login' ? 'Đăng nhập' : 'Đăng ký'}
						</Button>
						{refMode.current === 'login' && <LoginWGG />}
						{/* <LoginWFB /> */}
					</div>
					{refMode.current === 'login' && (
						<Link
							to="/quenmatkhau"
							style={{ color: 'blue', margin: '10px 0', textAlign: 'right' }}
							// onClick={onClickQ}
						>
							Quên mật khẩu
						</Link>
					)}
				</form>
				<img
					className={classes.img}
					src="https://res.cloudinary.com/dzpks7wzs/image/upload/v1650377530/N16_ecommers/1_rpbiwh.jpg"
					alt="img"
				/>
				{/* <CancelOutlinedIcon onClick={handleClose} /> */}
			</Paper>
			{/* </Fade> */}
		</Dialog>
	);
}
Login = forwardRef(Login);
export default Login;
