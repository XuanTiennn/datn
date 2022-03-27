import { Box, Button, Container, Grid, Typography } from '@material-ui/core';
import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ContextGlobal } from './../../../../app/ContextGlobal/index';
import { Link } from 'react-router-dom';

Thumbnails.propTypes = {};

const useStyles = makeStyles((theme) => ({
	root: {},
	box: {
		position: 'relative',
		borderRadius: '15px',
		overflow: 'hidden',
		marginTop: '30px',
	},
	wrap: {
		[theme.breakpoints.down('sm')]: {
			overflow: 'hidden',
		},
	},
	img: {
		borderRadius: '15px',
	},
	text: {
		position: 'absolute',
		top: '15%',
		left: '5%',
		padding: '1.875rem 2.5rem',
	},
	discount: {
		color: '#FF6048',
		fontFamily: 'Dosis sans-serif',
		fontWeight: '600',
	},
	btn: {
		padding: '5px 10px',
		borderRadius: '15px',
	},
}));
function Thumbnails(props) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [category, setCategory] = state.productsAPI.category;
	return (
		<Container>
			<Grid container spacing={4} className={classes.root}>
				<Grid item xs={12} sm={12} md={6} lg={6} className={classes.box}>
					<Box className={classes.wrap}>
						<img
							className={classes.img}
							src="https://res.cloudinary.com/dzpks7wzs/image/upload/v1629258386/N16_ecommers/bacola-banner-11_bcionn.jpg"
							alt="imgthumbnails"
						/>
						<Box className={classes.text}>
							<Typography className={classes.discount} variant="h5" component="h4">
								Giảm giá 40%
							</Typography>
							<Typography variant="h4" component="h3">
								Cookie and Ice Cream
								<Typography variant="body1" component="p">
									Bacola Weekend Discount
								</Typography>
							</Typography>
							<Link to="/products">
								<Button
									className={classes.btn}
									variant="contained"
									color="primary"
									onClick={() => setCategory('category=dauhat')}
								>
									Mua ngay
								</Button>
							</Link>
						</Box>
					</Box>
				</Grid>
				<Grid item xs={12} sm={12} md={6} lg={6} className={classes.box}>
					<Box className={classes.wrap}>
						<img
							className={classes.img}
							src="https://res.cloudinary.com/dzpks7wzs/image/upload/v1629258390/N16_ecommers/bacola-banner-12_efmxae.jpg"
							alt="imgthumbnails"
						/>
						<Box className={classes.text}>
							<Typography className={classes.discount} variant="h5" component="h4">
								Giảm giá 30%
							</Typography>
							<Typography variant="h4" component="h3">
								Cookie and Ice Cream
								<Typography variant="body1" component="p">
									Bacola Weekend Discount
								</Typography>
							</Typography>
							<Link to="/products">
								{' '}
								<Button
									className={classes.btn}
									variant="contained"
									color="primary"
									onClick={() => setCategory('category=douong')}
								>
									Mua ngay
								</Button>
							</Link>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}

export default Thumbnails;
