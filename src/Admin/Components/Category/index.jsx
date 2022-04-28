import {
	Box,
	Container,
	Grid,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableRow,
	TextField,
	Typography,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import React, { useContext, useRef, useState } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';
import { Button } from 'primereact/button';

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
	const toast = useRef(null);
	//console.log(category);

	const classes = useStyles();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (isEdit) {
				const res = await axios.put(
					`/api/category/${getId}`,
					{ name: value, images },
					{ headers: { Authorization: token } }
				);
				alert(res.data.mgs);
			} else {
				const res = await axios.post(
					'/api/category',
					{ name: value, images },
					{ headers: { Authorization: token } }
				);
				alert(res.data.mgs);
			}
			// showWarning();
			setValue('');
			setIsEdit(false);
			setImages({});
			setCallback(!callback);
		} catch (err) {
			console.log(err);
		}
	};

	const handleEdit = (id, name) => {
		setId(id);
		setValue(name);
		setIsEdit(true);
	};
	const handleImgChange = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert('Bạn không được phép thực hiện thao tác này.');
			const file = e.target.files[0];

			if (!file) return alert('File không tồn tại.');

			if (file.size > 1024 * 1024) return alert('Dung lượng ảnh vượt mức cho phép.');

			if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert('Ảnh sai định dạng.');

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
	const showWarning = () => {
		toast.current.show({
			severity: 'success',
			summary: 'Thao tác thành công',
			life: 3000,
		});
	};
	console.log(toast);
	const handleRemove = async (id) => {
		try {
			if (window.confirm('bạn có muốn xóa loại sản phẩm này không ?')) {
				const res = await axios.delete(`/api/category/${id}`, { headers: { Authorization: token } });

				alert(res.data.mgs);
				setCallback(!callback);
			}
		} catch (err) {
			const failr = err.response.data.mgs;
			alert(failr);
		}
	};
	if (category.length === 0) {
		return (
			<Paper className={classes.root}>
				<Typography component="h2" variant="h3">
					Bạn chưa có loại sản phẩm nào
				</Typography>
				<Toast ref={toast} />

				<form className={classes.form} onSubmit={handleSubmit}>
					<TextField
						required="true"
						type="text"
						name="category"
						onChange={(e) => setValue(e.target.value)}
						label="Thêm mới"
						value={value}
					/>
					<Button type="submit" variant="contained" color="primary">{`${isEdit ? 'Sửa' : 'Tạo mới'}`}</Button>
				</form>
			</Paper>
		);
	}
	return (
		<Paper className={classes.root}>
			<Container>
				<Typography variant="h5" component="h2" style={{ padding: '15px 0' }}>
					Quản lý loại sản phẩm
				</Typography>
				<Grid container spacing={2} style={{ justifyContent: 'space-around' }}>
					<Grid item>
						<form className={classes.form} onSubmit={handleSubmit}>
							<TextField
								type="text"
								name="category"
								onChange={(e) => setValue(e.target.value)}
								value={value}
								label={isEdit ? 'Sửa' : 'Thêm mới'}
								required
							/>
							<Button type="submit" variant="contained" color="primary">{`${
								isEdit ? 'Sửa' : 'Tạo mới'
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
							<Box className={classes.images}>
								<>
									<img className={classes.img} src={images ? images.url : ''} alt="img" />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleRemoveImage(images.public_id)}
									/>
								</>
							</Box>
						)}
					</Grid>
					<Grid component="ul" item>
						<Table>
							<TableBody>
								{category.map((cate) => (
									<TableRow key={cate._id}>
										<TableCell className={classes.fontsize}>
											<Typography variant="h6">{cate.name}</Typography>
										</TableCell>
										<TableCell>
											<Button
												icon="pi pi-pencil p-button-warning"
												onClick={() => handleEdit(cate._id, cate.name)}
												label="Sửa"
											></Button>
										</TableCell>

										<TableCell>
											<Button
												className="p-button-outlined p-button-danger "
												icon="pi pi-trash"
												onClick={() => handleRemove(cate._id)}
												label="Xóa"
											></Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Grid>
				</Grid>
			</Container>
		</Paper>
	);
}

export default Category;
