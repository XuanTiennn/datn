import { Switch, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ShowConfirmFunction from 'utils/commonFunction';
import { ContextGlobal } from '../../../app/ContextGlobal/index';
import { XLayout, XLayout_Center, XLayout_Top } from '../../../Components/x-layout/XLayout';
import Loading from '../../../features/Components/Process';
import XToolbar from './../../../Components/x-toolbar/XToolbar';
import Enumeration from './../../../utils/enum';
import NewDetail from './newDetail';
import Pagination from '@material-ui/lab/Pagination';
News.propTypes = {};
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

function News(props) {
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
	const [news, setNews] = useState();

	useEffect(async () => {
		const res = await axios.get('/api/news');
		setNews(res.data);
	}, [callback]);
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

	const handleChangStatus = async (e, id) => {
		try {
			const { checked } = e.target;
			setLoading(true);
			await axios.patch('/api/news', { id, status: checked });
			setCallBack(!callback);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	const onPage = (event) => {
		setPage(event.page);
	};

	if (loading) return <Loading />;
	try {
		return (
			<XLayout className="p-p-2">
				<XLayout_Top>
					<XToolbar
						className="p-mb-2"
						left={() => (
							<Button
								variant="contained"
								// className={classes.button}
								icon="pi pi-plus-circle"
								onClick={() => addProduct()}
							>
								Thêm mới
							</Button>
						)}
					></XToolbar>
				</XLayout_Top>

				<XLayout_Center className="position-relative">
					<DataTable
						value={news}
						responsiveLayout="scroll"
						className="p-datatable-customers"
						dataKey="_id"
						rowHover
						selection={selectedServices}
						onSelectionChange={(e) => setSelectedServices(e.value)}
						emptyMessage="No customers found."
						showGridlines
					>
						<Column
							field="title"
							header={<label className="require">{'Tiêu đề'}</label>}
							style={{ flex: '1 0 250px' }}
						></Column>

						<Column
							field="status"
							header={<label className="require">{'Trạng thái'}</label>}
							style={{ flex: '1 0 20px' }}
							body={(row) => (
								<Switch
									checked={row.status}
									color="primary"
									name="status"
									onChange={(e) => handleChangStatus(e, row._id)}
								/>
							)}
						></Column>

						<Column
							frozen
							alignFrozen="right"
							headerClassName="frozen-right-first-column"
							header={'Thao tác'}
							body={(row) => (
								<>
									<div>
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
							style={{ flex: '0 0 50px' }}
						></Column>
					</DataTable>
				</XLayout_Center>
				<ShowConfirmFunction title="Bạn có chắc chắn muốn xóa bản ghi này ?" ref={refConfirm} />
				<NewDetail ref={ref} />
				{/* <Box style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
					<Pagination
						count={Math.ceil(news?.length / 9)}
						color="primary"
						page={page}
						onChange={(e, value) => setPage(value)}
					/>
				</Box> */}
			</XLayout>

			// 	{/* <ConfirmDelete ref={ref} /> */}
			// </Paper>
		);
	} catch (error) {
		console.log(error);
	}
}

export default News;
