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
AddProduct.propTypes = {};

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
	wrapfile: {
		position: 'relative',
	},
	input: {
		margin: theme.spacing(1, 0),
		maxWidth: '100%',
	},
	fileinput: {},
	images: {
		position: 'relative',
	},
	img: {
		maxWidth: '100px',
	},
	iconClear: {
		position: 'absolute',
		top: '0',
		right: '0',
		cursor: 'pointer',
		color: 'white',
	},
	select: {
		maxWidth: '150px',
		margin: theme.spacing(2, 0),
	},
}));

function AddProduct(props) {
	const state = useContext(ContextGlobal);
	const { productId, getPayload } = props;
	const [category] = state.categoryApi.category;
	const [isAdmin] = state.userApi.isAdmin;
	const [callback, setCallBack] = state.productsAPI.callback;
	const [products] = state.productsAPI.products;
	const [token] = state.token;
	const [images, setImages] = useState(false);
	const [imagess, setImagess] = useState([]);
	const [isEdit, setIsEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const initState = {
		product_id: randomId(),
		title: '',
		price: '',
		description: '',
		content: '',
		category: '',
		color: '',
		salePercent: 0,
		remain: '',
	};
	const history = useHistory();
	const params = useParams();

	const classes = useStyles();
	const [product, setProduct] = useState(initState);
	useEffect(async () => {
		if (productId) {
			setIsEdit(true);
			const item = await axios.get(`/api/products/${productId}`);

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
			if (!isAdmin) return alert('B???n kh??ng ph???i m???t admin');
			if (!images) return alert('Kh??ng c?? ???nh n??o ???????c upload');

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
	const handleImgsChange = async (e) => {
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
			const _imgs = [...imagess];
			_imgs.push(res.data);
			setImagess(_imgs);
			setLoading(false);
			// getPayload(product, res.data);
		} catch (err) {
			const failr = err.response.data.msg;
			alert(failr);
		}
	};
	console.log(imagess);
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
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									value={product.title}
									onChange={(e) => handleChange('title', e.target.value)}
								/>
								<label className="require">{'T??n s???n ph???m'}</label>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputNumber
									// type="number"
									placeholder="Gi?? s???n ph???m"
									value={product.price}
									onChange={(e) => handleChange('price', e.value)}
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									value={product.content}
									onChange={(e) => handleChange('content', e.target.value)}
								/>
								<label className="require">{'Th??ng tin chi ti???t'}</label>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									value={product.description}
									onChange={(e) => handleChange('description', e.target.value)}
								/>
								<label className="require">{'Mi??u t???'}</label>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									placeholder="c??n n???ng"
									value={product.weight}
									onChange={(e) => handleChange('weight', e.target.value)}
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									placeholder="chi???u d??i"
									value={product.instock}
									onChange={(e) => handleChange('instock', e.target.value)}
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									placeholder="ship"
									value={product.shipment}
									onChange={(e) => handleChange('shipment', e.target.value)}
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									placeholder="Ngu???n g???c"
									value={product.origin}
									onChange={(e) => handleChange('origin', e.target.value)}
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<Dropdown
									value={product.category}
									options={category}
									optionValue="name"
									optionLabel="name"
									onChange={(e) => handleChange('category', e.target.value)}
								/>
								<label className="require">{'Lo???i s???n ph???m'}</label>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<InputText
									value={product.remain}
									onChange={(e) => handleChange('remain', e.target.value)}
									placeholder="S??? l?????ng c??n"
								/>
							</span>
						</div>
						<div className="p-field p-col-4 p-md-3">
							<span className="p-float-label">
								<Dropdown
									placeholder="M??u s???c"
									value={product.color}
									options={Enumeration.color_product}
									optionLabel="name"
									optionValue="code"
									onChange={(e) => handleChange('color', e.value)}
								/>
								{/* <label className="require">{'M??u s???c'}</label> */}
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
						<br></br>
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgsChange}
						/>
						{loading ? (
							<Loading />
						) : (
							<Box className={classes.images}>
								<>
									<img className={classes.img} src={imagess ? imagess?.[0]?.url : ''} alt="img" />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleImgsChange(images.public_id)}
									/>
								</>
							</Box>
						)}
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgsChange}
						/>
						{loading ? (
							<Loading />
						) : (
							<Box className={classes.images}>
								<>
									<img className={classes.img} src={imagess ? imagess?.[1]?.url : ''} alt="img" />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleImgsChange(images.public_id)}
									/>
								</>
							</Box>
						)}
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgsChange}
						/>
						{loading ? (
							<Loading />
						) : (
							<Box className={classes.images}>
								<>
									<img className={classes.img} src={imagess ? imagess?.[2]?.url : ''} alt="img" />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleImgsChange(images.public_id)}
									/>
								</>
							</Box>
						)}
						<TextField
							type="file"
							name="file"
							required="true"
							className={classes.fileinput}
							onChange={handleImgsChange}
						/>
						{loading ? (
							<Loading />
						) : (
							<Box className={classes.images}>
								<>
									<img className={classes.img} src={imagess ? imagess?.[3]?.url : ''} alt="img" />{' '}
									<ClearIcon
										className={classes.iconClear}
										onClick={() => handleImgsChange(images.public_id)}
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

export default AddProduct;
