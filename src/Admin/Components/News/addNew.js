import { Box, Button, Container, Grid, makeStyles, NativeSelect, Paper, TextField } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal';
import Loading from '../../../features/Components/Process';
import { InputText } from 'primereact/inputtext';
import { XLayout, XLayout_Box, XLayout_Top } from '../../../Components/x-layout/XLayout';
import { Dropdown } from 'primereact/dropdown';
import Enumeration from 'utils/enum';
import randomId from './../../../utils/randomId';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
AddNew.propTypes = {};

const useStyles = makeStyles((theme) => ({
	form: {
		display: 'flex',
		flexDirection: 'column',
		maxWidth: '350px',
	},
	flex: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	select: {
		maxWidth: '150px',
		margin: theme.spacing(2, 0),
	},
}));

function AddNew(props) {
	const state = useContext(ContextGlobal);
	const { productId, getPayload } = props;
	const [category] = state.categoryApi.category;
	const [isAdmin] = state.userApi.isAdmin;
	const [callback, setCallBack] = state.productsAPI.callback;
	const [products] = state.productsAPI.products;
	const [token] = state.token;
	const [images, setImages] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const initState = {
		_id: randomId(),
		title: '',
		content: '',
		status: true,
	};
	const history = useHistory();
	const params = useParams();
	//console.log(params);
	const classes = useStyles();
	const [product, setProduct] = useState(initState);
	useEffect(async () => {
		if (productId) {
			setIsEdit(true);
			const item = await axios.get(`/api/news/${productId}`);

			setProduct(item.data);
			setImages(item.data.images);
		} else {
			setIsEdit(false);
			setProduct(initState);
			setImages(false);
		}
	}, [params.id, products]);

	const handleChange = (prop, value) => {
		const _product = { ...product };
		_product[prop] = value;
		setProduct(_product);
		getPayload(_product, images);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!isAdmin) return alert('Bạn không phải một admin');
			if (!images) return alert('Không có ảnh nào được upload');

			if (isEdit) {
				const res = await axios.put(
					`/api/products/${product._id}`,
					{ ...product, images },
					{ headers: { Authorization: token } }
				);
				// alert(res.data.msg);
			} else {
				await axios.post('/api/products', { ...product, images }, { headers: { Authorization: token } });
			}
			history.push('/admin/products');
			setCallBack(!callback);
		} catch (error) {
			const failr = error.response.data.msg;
			alert(failr);
		}
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
			getPayload(product, res.data);
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
	return (
		<XLayout_Box className="p-p-2">
			<XLayout>
				<XLayout_Top>
					<div className="p-grid p-formgrid p-fluid">
						
						<div className="p-field p-col-4 p-md-6">
							<span className="p-float-label">
								<InputText
									value={product.title}
									onChange={(e) => handleChange('title', e.target.value)}
								/>
								<label className="require">{'Tên bài viết'}</label>
							</span>
						</div>

						<div className="p-field p-col-4 p-md-12">
							<span className="p-float-label">
								<InputTextarea
									rows={5}
									cols={30}
									placeholder="Nội dung bài viết"
									value={product.content}
									onChange={(e) => handleChange('content', e.target.value)}
								/>
								{/* <label className="require">{'Màu sắc'}</label> */}
							</span>
						</div>
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgChange}
						/>
						{loading ? (
							<Loading />
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
					</div>
				</XLayout_Top>
			</XLayout>
		</XLayout_Box>
	);
}

export default AddNew;
