import { Box, Container, Grid, makeStyles, Paper, TextField, Typography } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
	},
	fontsize: {
		fontSize: theme.spacing(3),
	},
	form: {
		display: 'flex',
		alignItems: 'center',
		marginTop: '10px',
	},
	img: {
		width: '80px',
	},
}));
function Category(props) {
	const state = useContext(ContextGlobal);
	const [category] = state.categoryApi.category;
	const [callback, setCallback] = state.categoryApi.callback;
	const [token] = state.token;
	const [value, setValue] = useState('');
	const [getId, setId] = useState('');
	const [images, setImages] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const [isAdmin] = state.userApi.isAdmin;
	const toast = useRef();

	const classes = useStyles();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			let res;
			if (isEdit) {
				res = await axios.put(
					`/api/category/${getId}`,
					{ name: value, images },
					{ headers: { Authorization: token } }
				);
			} else {
				res = await axios.post('/api/category', { name: value, images }, { headers: { Authorization: token } });
			}
			if (res.status == 200) {
				setValue('');
				setIsEdit(false);
				setImages({});
				setCallback(!callback);
				console.log(res);
				showSuccess(res.data.mgs);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleEdit = (id, name, images) => {
		setId(id);
		setValue(name);
		setIsEdit(true);
		setImages(images);
	};
	const handleImgChange = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert('B???n kh??ng ???????c ph??p th???c hi???n thao t??c n??y.');
			const file = e.target.files[0];

			if (!file) return alert('File kh??ng t???n t???i.');

			if (file.size > 1024 * 1024) return alert('Dung l?????ng ???nh v?????t m???c cho ph??p.');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert('???nh sai ?????nh d???ng.');

			let formData = new FormData();
			formData.append('file', file);
			setLoading(true);
			const res = await axios.post('/api/upload', formData, {
				headers: { 'content-type': 'multipart/form-data', Authorization: token },
			});

			setImages(res.data);
			setLoading(false);
		} catch (err) {
			const failr = err.response.data.msg;
			alert(failr);
		}
	};
	const handleRemoveImage = async (public_id) => {
		try {
			await axios.post('/api/destroy', { public_id }, { headers: { Authorization: token } });
			setImages(false);
		} catch (error) {
			console.log(error);
		}
	};
	const showSuccess = (title) => {
		toast.current.show({
			severity: 'success',
			summary: 'Thao t??c th??nh c??ng',
			detail: title,
			life: 3000,
		});
	};
	const showWarr = (title) => {
		toast.current.show({
			severity: 'warn',
			summary: 'Thao t??c th???t b???i',
			detail: title,
			life: 3000,
		});
	};

	const handleRemove = async (id) => {
		try {
			if (window.confirm('B???n c?? mu???n x??a lo???i s???n ph???m n??y kh??ng ?')) {
				const res = await axios.delete(`/api/category/${id}`, { headers: { Authorization: token } });
				if (res) {
					showSuccess(res.data.mgs);
					setCallback(!callback);
				}
			}
		} catch (err) {
			showWarr(err.data.mgs);
		}
	};

	if (category.length === 0) {
		return (
			<Paper className={classes.root}>
				<Typography component="h2" variant="h3">
					B???n ch??a c?? lo???i s???n ph???m n??o
				</Typography>
				<form className={classes.form} onSubmit={handleSubmit}>
					<TextField
						required="true"
						type="text"
						name="category"
						onChange={(e) => setValue(e.target.value)}
						label="Th??m m???i"
						value={value}
					/>
					<Button type="submit" variant="contained" color="primary">{`${isEdit ? 'S???a' : 'T???o m???i'}`}</Button>
				</form>
			</Paper>
		);
	}
	return (
		<Paper className={classes.root}>
			<Toast ref={toast} position="bottom-right" />{' '}
			<Container>
				<Typography variant="h5" component="h2" style={{ padding: '15px 0' }}>
					Qu???n l?? danh m???c s???n ph???m
				</Typography>
				<Grid container style={{ justifyContent: 'space-evenly' }}>
					<Grid item>
						<form className={classes.form} onSubmit={handleSubmit}>
							<TextField
								type="text"
								name="category"
								onChange={(e) => setValue(e.target.value)}
								value={value}
								label={isEdit ? 'S???a' : 'Th??m m???i'}
								required
							/>
							<Button type="submit" variant="contained" color="primary">{`${
								isEdit ? 'S???a' : 'T???o m???i'
							}`}</Button>
						</form>
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgChange}
						/>
						{loading ? (
							<ProgressSpinner />
						) : (
							<Box className="p-mt-3">
								<>
									<img className={classes.img} src={images ? images.url : ''} />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleRemoveImage(images.public_id)}
									/>
								</>
							</Box>
						)}
					</Grid>
					<Grid component="ul" item>
						<DataTable
							value={category}
							responsiveLayout="scroll"
							className="p-datatable-customers"
							dataKey="_id"
							rowHover
							emptyMessage="No customers found."
							showGridlines
						>
							<Column
								field="name"
								header="???nh"
								body={(d) => <img style={{ width: '30px' }} src={d.images?.url} />}
							></Column>
							<Column field="name" header="T??n danh m???c"></Column>
							<Column
								field="name"
								header="Thao t??c"
								body={(d) => (
									<>
										<Button
											icon="pi pi-pencil p-button-warning"
											onClick={() => handleEdit(d._id, d.name, d.images)}
											label="S???a"
										></Button>
										<Button
											className="p-button-outlined p-button-danger "
											icon="pi pi-trash"
											onClick={() => handleRemove(d._id)}
											label="X??a"
										></Button>
									</>
								)}
							></Column>
						</DataTable>
					</Grid>
				</Grid>
			</Container>
		</Paper>
	);
}

export default Category;
