import { Box, Checkbox, Container, Grid, NativeSelect, Switch, Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Pagination from '@material-ui/lab/Pagination';
import axios from 'axios';
import { ConfirmDialog } from 'primereact/confirmdialog';
import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal/index';
import Loading from '../../../features/Components/Process';
import { Dialog } from 'primereact/dialog';
import ProductDetail from './productDetail';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { XLayout, XLayout_Center, XLayout_Top } from '../../../Components/x-layout/XLayout';
import Login from './../../../features/Components/Login/login';
import Enumeration from './../../../utils/enum';
import XToolbar from './../../../Components/x-toolbar/XToolbar';
import ShowConfirmFunction from 'utils/commonFunction';
import FormatNumber from './../../../utils/formatNumber';
Products.propTypes = {};
const useStyles = makeStyles({
	table: {
		width: '100%',
	},
	img: {
		maxWidth: '50px',
	},
	box: { display: 'flex', justifyContent: 'space-between' },
	button: {
		backgroundColor: '#01a9ac',
		color: 'white',
		marginTop: '15px',
		'&:hover': {
			backgroundColor: '#01dbdf',
		},
	},
	buttonRemove: {
		width: '100px',
	},
	buttonedit: {
		backgroundColor: 'orange',
		color: 'white',
		'&:hover': {
			backgroundColor: 'gray',
		},
	},
	select: {
		margin: '15px 0',
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
});

function Products(props) {
	const state = React.useContext(ContextGlobal);
	const [products, setProducts] = state.productsAPI.products;
	const [callback, setCallBack] = state.productsAPI.callback;
	const [page, setPage] = state.productsAPI.page;
	const [category, setCategory] = state.productsAPI.category;
	const [allProduct] = state.productsAPI.allProduct;
	const [token] = state.token;
	const [ischecked, setIsChecked] = useState(false);
	const [checked, setchecked] = useState(false);
	const classes = useStyles();
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [selectedServices, setSelectedServices] = useState(null);
	const ref = useRef(null);
	const refConfirm = useRef(null);
	const [open, setOpen] = useState(false);
	
	const actionPopUp = async (id, public_id, multiple) => {
		if (multiple) {
			refConfirm.current.multiple(id, public_id);
		} else {
			refConfirm.current.show(id, public_id);
		}
	};

	const handleChange = (id) => {
		products.forEach((item) => {
			if (item._id === id) {
				item.checked = !item.checked;
				setchecked(item.checked);
			}
		});
		setProducts([...products]);
	};
	const handleCheckAll = () => {
		products.forEach((item) => {
			item.checked = !ischecked;
			setchecked(item.checked);
		});
		setProducts([...products]);
		setIsChecked(!ischecked);
	};
	const updateItem = (id) => {
		ref.current.show(id);
	};
	const addProduct = (id) => {
		ref.current.create();
	};
	console.log(products);
	const handleChangStatus = async (e, id) => {
		try {
			const { checked } = e.target;
			setLoading(true);
			await axios.patch('/api/products', { id, status: checked });
			setCallBack(!callback);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const onPage = (event) => {
		setPage(event.page);
	};
	console.log(products);
	if (loading) return <Loading />;
	try {
		return (
			// <Paper>
			// 	<Container>
			// 		<Typography variant="h5" component="h2" style={{ padding: '15px 0' }}>
			// 			Quản lý sản phẩm({allProduct.count})
			// 		</Typography>
			// 		<Grid container>
			// 			<Grid item style={{ width: '100%' }}>
			// 				<Box className={classes.box}>
			// 					<Tooltip title="Xóa những mục được chọn">
			// 						<Button
			// 							variant="contained"
			// 							className={classes.buttonRemove}
			// 							color="secondary"
			// 							onClick={handleRemoveAll}
			// 							startIcon={<DeleteIcon />}
			// 							disabled={!checked}
			// 						>
			// 							Xóa
			// 						</Button>
			// 					</Tooltip>

			// <Button
			// 	variant="contained"
			// 	className={classes.button}
			// 	startIcon={<AddIcon />}
			// 	onClick={() => history.push('addproduct')}
			// >
			// 	Thêm mới
			// </Button>
			// 				</Box>
			// 				<Box className={classes.select}>
			// 					<Typography variant="body1" component="span" style={{ marginRight: '15px' }}>
			// 						Lọc theo mặt hàng
			// 					</Typography>
			// 					<NativeSelect
			// 						// onChange={handleChange}
			// 						value={category}
			// 						name="category"
			// 						onChange={(e) => setCategory(e.target.value)}
			// 					>
			// 						<option value="">Chọn</option>
			// 						<option value="category=dienthoai">Điện thoại</option>
			// 						<option value="category=laptop">Laptop</option>
			// 						<option value="category=quanao">Thời trang</option>
			// 						<option value="category=mypham">Mỹ phẩm</option>
			// 					</NativeSelect>
			// 				</Box>
			// 				<TableContainer>
			//
			// 					</Table>
			// 				</TableContainer>
			// 			</Grid>
			// 		</Grid>
			// 	</Container>
			<XLayout className="p-p-2">
				<XLayout_Top>
					<XToolbar
						className="p-mb-2"
						left={() => (
							<Button variant="contained" icon="pi pi-plus-circle" onClick={() => addProduct()}>
								Thêm mới
							</Button>
						)}
						right={() => (
							<>
								<NativeSelect
									// onChange={handleChange}
									value={category}
									name="category"
									onChange={(e) => setCategory(e.target.value)}
								>
									{' '}
									<option value="">Tất cả</option>
									{state.categoryApi.category[0].map((item) => (
										<option value={`category=${item.name}`}>{item.name}</option>
									))}
								</NativeSelect>
							</>
						)}
					></XToolbar>
				</XLayout_Top>

				<XLayout_Center className="position-relative" style={{ overflow: 'hidden' }}>
					<DataTable
						emptyMessage={'common.no-record-found'}
						scrollable
						scrollDirection="both"
						showGridlines
						value={products}
						className="p-datatable-customers"
						// selectionMode="checkbox"
						dataKey="_id"
						lazy
						selection={selectedServices}
						onSelectionChange={(e) => setSelectedServices(e.value)}
					>
						{/* <Column style={{ flex: '0 0 40px' }} selectionMode="multiple"></Column> */}
						<Column
							field="img"
							header={<label className="require">{'Ảnh'}</label>}
							style={{ flex: '1 0 50px', textAlign: 'center' }}
							body={(row) => (
								<div style={{ width: '100%' }}>
									<img className={classes.img} src={row.images.url} alt="" />
								</div>
							)}
						></Column>
						<Column
							field="title"
							header={<label className="require">{'Tên'}</label>}
							style={{ flex: '1 0 150px'}}
							body={(d)=><span style={{overflow:'hidden',maxWidth:'150px',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>{d.title}</span>}
						></Column>
						<Column
							field="price"
							// headerStyle={{ width: '100%', textAlign: 'center' }}
							header={<label className="require">{'Giá'}</label>}
							style={{ flex: '1 0 50px' }}
							body={(d) => <span style={{ width: '100%' }}>{FormatNumber(d.price)}</span>}
						></Column>
						<Column
							field="remain"
							header={<label className="require">{'Số lượng còn'}</label>}
							style={{ flex: '1 0 20px' }}
						
						></Column>
						<Column
							field="salePercen"
							header={<label className="require">{'Giảm giá'}</label>}
							style={{ flex: '1 0 20px', textAlign: 'center' }}
							body={(d) => <span style={{ marginLeft:'20px' }}>{d.salePercen}</span>}
						></Column>
						<Column
							field="sold"
							header={<label className="require">{'Đã bán'}</label>}
							style={{ flex: '1 0 50px', textAlign: 'center' }}
							body={(d) => <span style={{ marginLeft:'20px' }}>{d.sold}</span>}
						></Column>
						<Column
							frozen
							alignFrozen="right"
							// bodyClassName="p-p-0 p-d-flex p-jc-center p-ai-center frozen-right-first-column"
							headerClassName="frozen-right-first-column"
							header={'Thao tác'}
							body={(row) => (
								<>
									<div className="p-d-flex ">
										<Button
											className="p-button-rounded p-button-text"
											icon="pi pi-pencil"
											tooltip={Enumeration.crud.update}
											tooltipOptions={{ position: 'bottom' }}
											onClick={() => updateItem(row._id)}
										></Button>

										<Button
											className="p-button-rounded p-button-text "
											tooltip={Enumeration.crud.delete}
											tooltipOptions={{ position: 'bottom' }}
											icon="pi pi-trash"
											onClick={() => actionPopUp(row._id, row.images.public_id)}
										></Button>
									</div>
								</>
							)}
							style={{ flex: '0 0 80px' }}
						></Column>
					</DataTable>
					<Box style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
						<Pagination
							count={Math.ceil(allProduct.total / 9)}
							color="primary"
							page={page}
							onChange={(e, value) => setPage(value)}
						/>
					</Box>
				</XLayout_Center>
				<ShowConfirmFunction title="Bạn có chắc chắn muốn xóa bản ghi này ?" ref={refConfirm} />
				<ProductDetail ref={ref} />
			</XLayout>

			// 	{/* <ConfirmDelete ref={ref} /> */}
			// </Paper>
		);
	} catch (error) {
		console.log(error);
	}
}

export default Products;
