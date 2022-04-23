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
		marginTop: '20px',
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
				<Button className="p-button-sm" label="Hủy bỏ" onClick={onHide}></Button>
				<Button className="p-button-sm" label="Đồng ý" onClick={() => handleRemoveItem(product)}></Button>
			</>
		);
	};
	return (
		<Box className={classes.root}>
			<Dialog visible={show} onHide={onHide} header="Chú ý" footer={footer}>
				<p>Bạn muốn xoá sản phẩm này ra khỏi giỏ hàng?</p>
			</Dialog>
			<Container>
				<BreadCrumb str={match.url} />
				<Grid container spacing={2}>
					<Grid item xs={12} lg={8} className={classes.leftcol}>
						<h2>Giỏ hàng</h2>
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
													<form>
														<Box className={classes.flex}>
															<Typography
																className={classes.spanbutton}
																variant="body2"
																onClick={() => decrement(product)}
															>
																-
															</Typography>
															<input
																className={classes.input}
																value={product.quantity > 0 ? product.quantity : 0}
															/>
															<Typography
																className={classes.spanbutton}
																variant="body2"
																onClick={() => increment(product)}
															>
																+
															</Typography>
														</Box>
													</form>
													<Button
														className="p-button-outlined p-button-danger p-button-sm p-mt-2"
														onClick={() => handleRemove(product)}
														style={{ height: '20px' }}
														label="Xóa"
													></Button>
												</Box>
											</Box>
										</Box>
									))
								) : (
									<Typography>Không có sản phẩm nào trong giỏ hàng</Typography>
								)}
							</Box>
						</Paper>
					</Grid>
					<Grid item xs={12} lg={4} className={classes.rightcol}>
						<Paper className={classes.padding}>
							<Box>
								<Box className={classes.flexbetween}>
									<Typography variant="body2">Tạm tính :</Typography>
									<Typography variant="body2">
										{totalPrice > 0 ? FormatNumber(totalPrice) : 0}
									</Typography>
								</Box>
								<Box className={classes.flexbetween}>
									<Typography variant="body2">Thành Tiền :</Typography>
									<Typography className={classes.totalPricee} variant="body2">
										{totalPrice > 0 ? FormatNumber(totalPrice) : 0}
									</Typography>
								</Box>
								<Typography textAlign="right" variant="caption" gutterBottom>
									(Đã bao gồm VAT nếu có)
								</Typography>
							</Box>
							<Box></Box>
						</Paper>
						<Button style={{ marginTop: '10px', color: 'blueviolet', color: 'white' }} variant="contained">
							<Link style={{ color: 'white' }} to="checkout/payment">
								Tiến hành đặt hàng
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
