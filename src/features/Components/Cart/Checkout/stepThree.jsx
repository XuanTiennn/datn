import { Box, Container, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import FormatNumber from './../../../../utils/formatNumber';
import { Button } from 'primereact/button';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: '20px',
	},
	flex: { display: 'flex' },
	flexbetween: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	originalPric: {
		fontSize: '16px',
	},
	promotion: {
		marginLeft: theme.spacing(2),
	},
	button: {
		cursor: 'pointer',
		margin: theme.spacing(0, 1),
	},

	img: {
		maxWidth: '50px',
	},

	totalPricee: {
		color: 'rgb(254, 56, 52)',
		fontSize: '22px',
		fontWeight: '400',
		'& > nth:child(first-child)': {
			borderTop: '1px solid rgb(200, 200, 200)',
		},
	},
	rightcol: {
		[theme.breakpoints.down('md')]: {
			marginTop: '15px',
		},
	},
	title: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		maxWidth: '250px',
		overflow: 'hidden',
		webkitlineclamp: 2,
	},
}));
function Stepthree({ value = {}, handleChange }) {
	const state = useContext(ContextGlobal);
	const [cart, setCart] = state.userApi.cart;
	const [token] = state.token;
	const [totalPrice, setTotalPrice] = useState(0);
	//console.log(cart);

	const classes = useStyles();

	useEffect(() => {
		const getTotal = () => {
			const total = cart.reduce((total, item) => {
				return (total += item.quantity * item.price);
			}, 0);
			setTotalPrice(total);
		};
		getTotal();
	}, [cart]);
	// const momo = () => {
	// 	const res = axios.post('https://test-payment.momo.vn/gw_payment/transactionProcessor', {
	// 		accessKey: 'JfhWrPPlnbU8ohqz',
	// 		partnerCode: 'MOMOEO3220220510',
	// 		requestType: 'captureMoMoWallet',
	// 		notifyUrl: 'locahost:3000/',
	// 		returnUrl: 'locahost:3000/',
	// 		orderId: 'MM1540456472575',
	// 		amount: '150000',
	// 		orderInfo: 'SDK team.',
	// 		requestId: 'MM1540456472575',
	// 		extraData: 'email=abc@gmail.com',
	// 		signature: '',
	// 		secretKey:'umSz0pHl7z7mfXTSBvH06vU774heLAkx'
	// 	});
	// 	console.log(res);
	// };
	return (
		<Box className={classes.root}>
			<Container className="p-p-0">
				<Grid container>
					<Grid item xs={12} lg={8} className="p-p-0">
						<Box className="p-p-2 p-mr-2">
							{cart.length > 0 ? (
								cart.map((product) => (
									<Box
										className={classes.flex}
										justifyContent="space-between"
										component="li"
										key={product._id}
										style={{
											borderBottom: '1px solid #eee',
										}}
									>
										<img className={classes.img} src={product.images.url} alt="anh product" />
										<Box>
											<Typography className={classes.title} variant="body2">
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
											<Box></Box>
										</Box>
									</Box>
								))
							) : (
								<Typography>Không có sản phẩm nào trong giỏ hàng</Typography>
							)}
						</Box>
					</Grid>
					<Grid item xs={12} lg={4} className={classes.rightcol}>
						<Paper className="p-p-2">
							<Box>
								<Box className={classes.flexbetween}>
									<Typography variant="body2">Thành Tiền :</Typography>
									<Typography className={classes.totalPricee} variant="body2">
										{totalPrice > 0 ? FormatNumber(totalPrice) : 0}
									</Typography>
								</Box>
							</Box>
							<Box></Box>
						</Paper>
						<Button style={{ marginTop: '10px' }} className="p-button-outlined" onClick={handleChange}>
							Tiến hành đặt hàng
						</Button>
						{/* <Button style={{ marginTop: '10px' }} className="p-button-outlined" onClick={momo}>
							Thanh toán = momo
						</Button> */}
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}

export default Stepthree;
