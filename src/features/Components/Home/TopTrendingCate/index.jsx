import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext, useEffect, useState } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { ContextGlobal } from './../../../../app/ContextGlobal/index';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import axios from 'axios';
TopTrending.propTypes = {};
const useStyles = makeStyles((theme) => ({
	root: { marginTop: '30px' },
	title: { padding: '10px 0' },
	img: {
		width: '150px',
		height: '150px',
		borderRadius: '100%',
	},
	wrap: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: '100%',

		'&:hover': {
			color: 'orange',
			transition: '.5s',
		},
	},
}));
function TopTrending(props) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	const [category, setCategory] = state.productsAPI.category;
	const [categories, setCategories] = useState([]);
	useEffect(async () => {
		const res = await axios.get('api/category');
		setCategories(res.data);
	}, []);
	return (
		<XLayout className={classes.root}>
			<XLayout_Center style={{ backgroundColor: 'white' }}>
				<Typography
					className={classes.title}
					variant="h4"
					component="h3"
					style={{ color: 'rgb(238, 77, 45)', fontSize: '19px' }}
				>
					Danh mục
				</Typography>
				<Grid container>
					{categories?.map((item) => (
						<Grid item xs={12} sm={3} md={2}>
							<Link to="/products" onClick={() => setCategory('category=' + item.name)}>
								<Box className={classes.wrap}>
									<img className={classes.img} src={item?.images?.url} alt={item.name} />
									<Typography>{item.name}</Typography>
								</Box>
							</Link>
						</Grid>
					))}
				</Grid>
			</XLayout_Center>
		</XLayout>
	);
}

export default TopTrending;
