import { Button, Grid, Hidden, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import React, { useContext } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { useHistory } from 'react-router-dom';
import Enumeration from 'utils/enum';
import { ContextGlobal } from '../../../app/ContextGlobal';
const useStyles = makeStyles((theme) => ({
	root: {},
	img: {
		// maxHeight: '300px',
		display: 'block',
		// maxWidth: '300px',
		overflow: 'hidden',
		width: '100%',
		marginTop: '100px',
	},
	column: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
	box: {
		backgroundColor: 'white',
		padding: '50px',
	},
	title: {
		textTransform: 'capitalize',
		textAlign: 'left',
		marginLeft: '20px',
		padding: '0 20px',
		fontSize: '23px',
		width: '75%',
	},
	button: {
		marginTop: '15px',
	},
	arrowStyles: {
		position: 'absolute',
		zIndex: 2,
		top: 'calc(50% - 15px)',
		width: 30,
		height: 30,
		cursor: 'pointer',
	},

	indicatorStyles: {
		background: '#fff',
		width: 8,
		height: 8,
		display: 'inline-block',
		margin: '0 8px',
	},
}));

function Banner() {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [slider] = state.productsAPI.slide;

	const history = useHistory();
	return (
		<XLayout className={classes.root}>
			<XLayout_Center>
				<Carousel
					responsive={Enumeration.responsive}
					containerClass="carousel-container"
					removeArrowOnDeviceType={['tablet', 'mobile']}
					itemClass="carousel-item-padding-40-px"
					infinite={true}
					showDots={true}
					autoPlay={true}
					autoPlaySpeed={3000}
				>
					{slider?.map((item) => (
						<Grid className={classes.box} container key={item._id}>
							{/* <Hidden only={['xs', 'md', 'sm']}>
								<Grid className={classes.column} item lg={6}>
									<Typography className={classes.title} component="h2" variant="h2">
										{item.title}
									</Typography>
									<Button
										className={classes.button}
										onClick={() => history.push(`/products/${item.item_id.item_id}`)}
										color="secondary"
										variant="outlined"
									>
										Xem ngay
									</Button>
								</Grid>
							</Hidden> */}
							<Grid className={classes.column} item xs={12} sm={12} md={12} lg={12}>
								<img className={classes.img} src={item.images.url} alt="img" />
							</Grid>
						</Grid>
					))}
				</Carousel>
			</XLayout_Center>
		</XLayout>
	);
}

export default React.memo(Banner);
