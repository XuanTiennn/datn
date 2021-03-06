import { Box, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import clsx from 'clsx';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Link, useParams, useRouteMatch, useHistory } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal';
import FormatNumber from '../../../utils/formatNumber';
import BreadCrumb from '../BreadCrumb';
import Services from '../Service';
import RecentProducts from './recentProducts';
import { Button } from 'primereact/button';
import Comment from './../Comment/comment';
import ListComment from './../Comment/listcomment';
import Loading from 'Components/loading/loading';
import { SkeletonDemo } from './sketon';
const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: '50px',
		marginBottom: '50px',
	},
	box: {
		padding: theme.spacing(3),
	},
	infor: {
		[theme.breakpoints.up('sm')]: {
			marginLeft: '15px',
			fontSize: '16px',
		},
		display: 'flex',
		justifyContent: 'space-between',
		height: '100%',
		flexDirection: 'column',
	},
	flex: {
		display: 'flex',
		alignItems: 'center',
	},
	title: {
		textTransform: 'capitalize',
		fontWeight: '600',
		[theme.breakpoints.down('xs')]: {
			fontSize: '20px',
		},
	},
	price: {
		fontWeight: '600',
		fontSize: theme.spacing(3),
		margin: theme.spacing(2, 0),
		color: '#2a2a86',
	},
	description: {
		margin: theme.spacing(2, 0),
		lineHeight: '30px',
		padding: '20px',
		fontWeight: '400',
		[theme.breakpoints.down('xs')]: {
			fontSize: '24px',
		},
	},
	pricepercen: {
		marginLeft: '10px',
		fontSize: theme.spacing(2),
		margin: theme.spacing(2, 0),
	},
	originPrice: {
		fontSize: '12px',
		textDecoration: 'line-through',
		margin: '0 5px',
	},
	wrap_img: {
		display: 'flex',
		[theme.breakpoints.down('xs')]: {
			margin: '10px',
		},
	},
	img: {
		maxWidth: '444px',
		maxHeight: '444px',
		margin: 'auto',
		[theme.breakpoints.down('xs')]: {
			maxWidth: '100%',
		},
	},
	wap: {
		margin: theme.spacing(2, 0),
	},
	content: {
		marginTop: '50px',
		padding: '20px',
	},
	status: {
		width: '50px',
		height: '50px',
		color: '#00b853',
		borderRadius: '5px',
		padding: '5px',
		backgroundColor: '#e5f8ed',
	},
	category: {
		'&:hover': {
			textDecoration: 'underline',
		},
	},
}));
function DetailsProduct() {
	const data = useContext(ContextGlobal);
	const [products] = data.productsAPI.products;
	const [allProduct] = data.productsAPI.allProduct;
	const [isLogined] = data.userApi.isLogined;
	const state = useContext(ContextGlobal);
	const [category, setCategory] = state.productsAPI.category;
	const toast = useRef(null);
	const params = useParams();
	const [product, setProduct] = useState([]);
	const [comments, setcomments] = useState([]);
	const [loading, setloading] = useState(false);
	const classes = useStyles();
	let isService = '';
	const addCart = data.userApi.addToCart;
	useEffect(() => {
		if (params.id) {
			try {
				const getItem = async () => {
					setloading(true);
					let res = await axios.get(`/api/products/${params.id}`);
					let comments = await axios.get(`/api/comment/${params.id}?page=1&`);

					setcomments(comments.data);
					setProduct(res.data);
					setloading(false);
					res.data.views = res.data.views ? res.data.views + 1 : 1;
					await axios.put(`/api/products/${res.data._id}`, { ...res.data });
				};
				getItem();
			} catch (error) {
				console.log(error);
			}
		}
	}, [params.id, products]);
	const afterSubmit = (data) => {
		let _data = { ...comments };
		_data.comments.push(data);
		setcomments(_data);
	};
	const onPage = (data) => {
		setcomments(data);
	};
	function forhtmlContent() {
		return { __html: product.content };
	}
	function forhtmlDescription() {
		return { __html: product.description };
	}

	const addToCart = (to) => {
		if (product.remain <= 0) {
			alert('S???n ph???m n??y hi???n ???? h???t vui l??ng quay l???i sau !');
		} else if (!isLogined) {
			alert('Vui l??ng ????ng nh???p ????? th???c hi???n thao t??c n??y.');
		} else {
			addCart(product);
			if (to) {
				history.push('/cart');
			}
			showSuccess();
		}
	};
	const showSuccess = () => {
		toast.current.show({
			severity: 'success',
			summary: 'Thao t??c th??nh c??ng',
			detail: 'Th??m v??o gi??? h??ng th??nh c??ng !',
			life: 3000,
		});
	};
	const match = useRouteMatch();
	const history = useHistory();
	useEffect(() => {
		window.scrollTo(0, 0);
	}, [match.url]);

	if (product?.length === 0) {
		return <SkeletonDemo />;
	} else
		return (
			<Box style={{ backgroundColor: '#F7F8FD' }}>
				<Container className={classes.root}>
					<BreadCrumb str={match.url} title={product.title} />
					<div style={{ display: 'flex', position: 'relative' }}>
						<div>
							<Paper elevation={0} className={classes.box}>
								<Grid container>
									<Grid className={classes.wrap_img} item xs={12} sm={12} md={6} lg={6}>
										<img className={classes.img} src={product.images.url} alt="" />
									</Grid>
									<Grid item xs={12} sm={12} md={6} lg={6}>
										<Box className={classes.infor}>
											<Typography
												className={clsx(classes.title, 'font-inter')}
												component="h2"
												variant="h6"
											>
												{product.title}
											</Typography>
											<Typography className={classes.category} component="p" variant="body1">
												<Link
													to="/products"
													onClick={() => setCategory('category=' + product.category)}
												>
													<span style={{ color: 'rgb(130, 134, 158)' }}>Category:</span>
													<span style={{ color: 'rgb(20, 53, 195)' }}>
														{product.category}
													</span>
												</Link>
											</Typography>
											<Typography className={classes.sold} component="p" variant="body1">
												{product.sold > 0 ? `Sold ${product.sold} ` : ''}
											</Typography>
											<Typography className={classes.sold} component="p" variant="body1">
												{product.remain > 0 ? `remain ${product.remain} ` : ''}
											</Typography>

											<Typography className={classes.sold} component="p" variant="body1">
												Status:
												<Typography
													style={{ color: product.remain > 0 ? '' : 'red' }}
													className={classes.status}
													component="span"
													variant="body1"
												>
													{product.remain > 0 ? 'Stocking' : 'Out of stock'}
												</Typography>
											</Typography>
											<Typography className={clsx(classes.flex)} component="p" variant="body2">
												<Typography
													component="span"
													className={clsx(classes.price, 'font-dosis')}
												>
													{FormatNumber(product.price)}
												</Typography>
												<Typography
													variant="body2"
													color="textSecondary"
													component="p"
													className={classes.originPrice}
												>
													{product.salePercen > 0
														? FormatNumber(
																product.price * (product.salePercen / 100) +
																	product.price
														  )
														: ''}
												</Typography>
												<Typography
													component="span"
													variant="body2"
													className={classes.pricepercen}
												>
													{product.salePercen > 0 ? `-${product.salePercen}%` : ''}
												</Typography>
											</Typography>
											<Typography>{isService}</Typography>
											{/* <div style={{ display: 'flex' }}>
												<Button
													style={{
														width: '200px',
														backgroundColor: 'white',
														color: 'blueviolet',
													}}
													label="Mua ngay"
													onClick={() => addToCart(true)}
													className="p-button"
												></Button>

												<Button
													style={{ width: '200px' }}
													variant="contained"
													label="Th??m v??o gi??? h??ng"
													onClick={() => addToCart()}
													className="p-button-infor p-ml-2"
												></Button>
											</div> */}

											<Toast ref={toast} position='bottom-right' />
										</Box>
									</Grid>
								</Grid>
							</Paper>

							<Grid lg={10}>
								<Box className={classes.content}>
									<h2>INFORMATION DETAILS</h2>
									<Paper>
										<Grid container>
											<div
												className={classes.description}
												dangerouslySetInnerHTML={forhtmlContent()}
											/>
										</Grid>
									</Paper>
								</Box>
							</Grid>

							<Grid lg={12}>
								<Box className={classes.content}>
									<h2>PRODUCT DESCRIPTION</h2>
									<Paper>
										<Grid container>
											<Typography className={classes.description} component="p" variant="body1">
												<div
													className={clsx('font-inter', classes.isdescription)}
													dangerouslySetInnerHTML={forhtmlDescription()}
												/>
											</Typography>
										</Grid>
									</Paper>
								</Box>
							</Grid>
							<Grid lg={12}>
								<ListComment isLogined={isLogined} comments={comments} onPage={onPage} />
								{isLogined && <Comment product={product} state={state} afterSubmit={afterSubmit} />}
							</Grid>
						</div>
						{/* <Box>
						<Services />
					</Box> */}
						<div>
							<RecentProducts products={allProduct.products} product={product} />
						</div>{' '}
					</div>
				</Container>
			</Box>
		);
}

export default DetailsProduct;
