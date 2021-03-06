import { Box, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import { Button } from 'primereact/button';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal';
import FormatNumber from '../../../utils/formatNumber';
import BreadCrumb from '../BreadCrumb';
import CheckoutPayment from './Checkout/index';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { useHistory } from 'react-router-dom';
Cart.propTypes = {};

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(2, 0),
		marginTop: '80px',
	},
	flex: { display: 'flex' },
	flexbetween: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing(2, 0),
	},
	originalPric: {
		color: theme.palette.grey[600],
	},
	promotion: {
		marginLeft: theme.spacing(2),
	},
	padding: {
		padding: theme.spacing(2),
	},
	button: {
		cursor: 'pointer',
		margin: theme.spacing(0, 1),
	},
	input: {
		border: 'none',
		background: 'transparent',
		width: '35px',
		textAlign: 'center',
		fontSize: ' 13px',
		appearance: 'none',
		margin: '0px',
		height: '30px',
		borderTop: '1px solid rgb(200, 200, 200)',
		borderBottom: '1px solid rgb(200, 200, 200)',
		padding: ' 6px 12px',
	},
	img: {
		maxWidth: '80px',
		maxHeight: '80px',
		border: '1px solid #eee',
	},
	spanbutton: {
		border: '1px solid rgb(200, 200, 200)',
		color: 'rgb(153, 153, 153)',
		padding: ' 6px 12px',
		cursor: 'pointer',
		height: '30px',
		width: '30px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '14px',
	},
	totalPricee: {
		color: 'rgb(254, 56, 52)',
		fontSize: '22px',
		fontWeight: '400',
		'& > nth:child(first-child)': {
			borderTop: '1px solid rgb(200, 200, 200)',
		},
	},
	leftcol: {},
	rightcol: {
		[theme.breakpoints.down('md')]: {
			marginTop: '15px',
		},
	},
}));
function Cart(props) {
	const state = useContext(ContextGlobal);
	const [cart, setCart] = state.userApi.cart;
	const [token] = state.token;
	const [totalPrice, setTotalPrice] = useState(0);
	const match = useRouteMatch();
	const classes = useStyles();
	const [show, setShow] = useState(false);
	const [product, setproduct] = useState();
	useEffect(() => {
		window.scrollTo(0, 0);
		const getTotal = () => {
			const total = cart.reduce((total, item) => {
				return (total += item.quantity * item.price);
			}, 0);

			setTotalPrice(total);
		};
		getTotal();
	}, [cart]);

	const addToCart = async (cart) => {
		await axios.patch('/user/addcart', { cart }, { headers: { Authorization: token } });
	};

	const increment = (product) => {
		cart.forEach((item) => {
			if (item._id === product._id) {
				product.quantity += 1;
			}
		});
		setCart([...cart]);
		addToCart(cart);
	};
	const decrement = (product) => {
		cart.forEach((item) => {
			if (item._id === product._id) {
				product.quantity === 1 ? (product.quantity = 1) : (product.quantity -= 1);
			}
		});
		setCart([...cart]);
		addToCart(cart);
	};
	const onHide = () => {
		setShow(false);
	};
	const handleRemoveItem = (product) => {
		let idex;
		cart.map((item, index) => {
			if (item._id === product._id) {
				idex = index;
				cart.splice(idex, 1);
			}
		});
		setCart([...cart]);
		addToCart(cart);
		onHide();
	};
	const handleRemove = (product) => {
		setShow(true);
		setproduct(product);
	};
	const history = useHistory();
	const footer = () => {
		return (
			<>
				<Button className="p-button-sm" label="H???y b???" onClick={onHide}></Button>
				<Button className="p-button-sm" label="?????ng ??" onClick={() => handleRemoveItem(product)}></Button>
			</>
		);
	};

	return (
		<Box className={classes.root}>
			<Dialog visible={show} onHide={onHide} header="Ch?? ??" footer={footer}>
				<p>B???n mu???n xo?? s???n ph???m n??y ra kh???i gi??? h??ng?</p>
			</Dialog>
			<Container>
				<BreadCrumb str={match.url} />
				<Grid container spacing={2}>
					<Grid item xs={12} lg={8} className={classes.leftcol}>
						<h2>Gi??? h??ng</h2>
						<Paper className={classes.padding}>
							<Box>
								{cart.length > 0 ? (
									cart.map((product) => (
										<Box
											className={classes.flex}
											justifyContent="space-between"
											padding="9px 0"
											component="li"
											key={product._id}
											style={{
												borderBottom: '1px solid #eee',
											}}
										>
											<img className={classes.img} src={product.images.url} alt="image product" />
											<Box>
												<Typography
													onClick={() => history.push(`/products/${product._id}`)}
													variant="body2"
													className="p-ml-2"
													style={{ cursor: 'pointer' }}
												>
													{product.title}
												</Typography>
												<p className="p-ml-2">C??n:{product.remain}</p>
											</Box>
											<Box>
												<Box>
													<Box className={classes.flex}>
														<Typography variant="caption" className={classes.originalPric}>
															{FormatNumber(product.price * product.quantity)}
														</Typography>
													</Box>
												</Box>
												<Box>
													<Box className={classes.flex}>
														<Button
															style={{ width: '30px', height: '30px' }}
															onClick={() => decrement(product)}
															label="-"
															className="p-p-0"
															disabled={product.quantity == 1}
														></Button>
														<span
															style={{
																width: '30px',
																height: '30px',
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
															}}
														>
															{product.quantity > 0 ? product.quantity : 0}
														</span>
														<Button
															style={{ width: '30px', height: '30px' }}
															onClick={() => increment(product)}
															disabled={product.quantity === product.remain}
															label="+"
															className="p-p-0"
														></Button>
													</Box>

													<Button
														className="p-button-outlined p-button-danger p-button-sm p-mt-2"
														onClick={() => handleRemove(product)}
														style={{ height: '20px' }}
														label="X??a"
													></Button>
												</Box>
											</Box>
										</Box>
									))
								) : (
									<Typography>Kh??ng c?? s???n ph???m n??o trong gi??? h??ng</Typography>
								)}
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} lg={4} className={classes.rightcol}>
						<Paper className={classes.padding}>
							<Box>
								<Box className={classes.flexbetween}>
									<Typography variant="body2">T???m t??nh :</Typography>
									<Typography variant="body2">
										{totalPrice > 0 ? FormatNumber(totalPrice) : 0}
									</Typography>
								</Box>
								<Box className={classes.flexbetween}>
									<Typography variant="body2">Th??nh Ti???n :</Typography>
									<Typography className={classes.totalPricee} variant="body2">
										{totalPrice > 0 ? FormatNumber(totalPrice) : 0}
									</Typography>
								</Box>
							</Box>
							<Box></Box>
						</Paper>
						<Button style={{ marginTop: '10px', color: 'blueviolet', color: 'white' }} variant="contained">
							<Link style={{ color: 'white' }} to="checkout/payment">
								Ti???p t???c
							</Link>
						</Button>
						<Box
							style={{
								display: 'flex',
								alignItems: 'center',
								marginTop: '10px',
							}}
						></Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

export default Cart;
