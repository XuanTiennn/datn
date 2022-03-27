import { Box, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
import { ContextGlobal } from './../../../../app/ContextGlobal/index';
TopTrending.propTypes = {};

// const responsive = {
// 	desktop: {
// 		breakpoint: { max: 3000, min: 1024 },
// 		items: 6,
// 		slidesToSlide: 3, // optional, default to 1.
// 	},
// 	tablet: {
// 		breakpoint: { max: 1024, min: 464 },
// 		items: 4,
// 		slidesToSlide: 3, // optional, default to 1.
// 	},
// 	mobile: {
// 		breakpoint: { max: 464, min: 0 },
// 		items: 1,
// 		slidesToSlide: 1, // optional, default to 1.
// 	},
// };
const data = [
	{
		id: 1,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1629019387/N16_ecommers/1-150x150_vjpwvn.jpg',
		title: 'Component',
	},
	{
		id: 2,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1629019591/N16_ecommers/1f09ca269ced22deab40b80d5a9f59b0.jpg_e4jnew.webp',
		title: 'Thời trang nữ',
		category:'thoitrangnu'
	},
	{
		id: 3,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1629019475/N16_ecommers/3-150x150_o0jqti.jpg',
		title: 'TV',
		category:'tv'
	},
	{
		id: 4,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1629019398/N16_ecommers/5-150x150_ek4z3u.jpg',
		title: 'Tai nghe',
		category:'tainghe'
	},
	{
		id: 5,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1628912383/N16_ecommers/gb2ny7oufwwro0lbccd3.jpg',
		title: 'Thời trang nam',
		category:'thoitrangnam'
	},
	{
		id: 6,
		img: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1628911562/N16_ecommers/gv9pvtoexkjq4huw9iug.jpg',
		title: 'Thời trang nữ',
		category:'thoitrangnu'
	},
];
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
	return (
		<Box className={classes.root}>
			<Typography className={classes.title} variant="h4" component="h3">
				Top Trending Category
			</Typography>
			<Grid container>
				{data.map((item) => (
					<Grid item xs={12} sm={3} md={2}>
						<Link to="/products" onClick={()=>setCategory('category='+item.category)}>
							<Box className={classes.wrap}>
								<img className={classes.img} src={item.img} alt={item.title} />
								<Typography>{item.title}</Typography>
							</Box>
						</Link>
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export default TopTrending;
