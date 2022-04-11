import { Box, Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { XLayout_Title } from '../../../../Components/x-layout/XLayout';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ContextGlobal } from './../../../../app/ContextGlobal/index';
import { Carousel } from 'react-multi-carousel';
import Enumeration from 'utils/enum';

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
		transition:'.4s',
		'&:hover':{
			transform:'scale(1.1)',
			transition:'.4s'
		}
	},
	text: {
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
	const arr = [
		{
			id: 0,
			title: 'Microsoft',
			img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649644056/N16_ecommers/unnamed1_p5pmze.webp',
			category: 'Microsoft',
		},
		{
			id: 1,
			title: 'Lenovo',
			img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649644173/N16_ecommers/unnamed4_gnawvm.webp',
			category: 'Lenovo',
		},
		{
			id: 2,
			title: 'Asus',
			img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649643948/N16_ecommers/unnamed_hayk0a.webp',
			category: 'Asus',
		},
		{
			id: 3,
			title: 'HP',
			img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649644132/N16_ecommers/unnamed2_c7vn2c.webp',
			category: 'HP',
		},
	];

	return (
		<Container>
			<Grid container spacing={4} className={classes.root}>
				{arr.map((item) => (
					<Grid item xs={12} sm={12} md={6} lg={3} className={classes.box}>
						<Link to="/products">
							{' '}
							<Box className={classes.wrap} onClick={() => setCategory(`category=${item.category}`)}>
								<img
									className={classes.img}
									style={{ height: '155px' }}
									src={item.img}
									alt="imgthumbnails"
								/>

								<XLayout_Title style={{ textAlign: 'center' }}>{item.title}</XLayout_Title>
							</Box>
						</Link>
					</Grid>
				))}{' '}
			</Grid>
		</Container>
	);
}

export default Thumbnails;
