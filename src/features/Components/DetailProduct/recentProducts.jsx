import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import ProductItem from '../Products/product';

// const responsive = {
// 	desktop: {
// 		breakpoint: { max: 3000, min: 1024 },
// 		items: 1,
// 		slidesToSlide: 1, // optional, default to 1.
// 	},
// 	tablet: {
// 		breakpoint: { max: 1024, min: 464 },
// 		items: 1,
// 		slidesToSlide: 1, // optional, default to 1.
// 	},
// 	mobile: {
// 		breakpoint: { max: 464, min: 0 },
// 		items: 1,
// 		slidesToSlide: 1, // optional, default to 1.
// 	},
// };
export default function RecentProducts({ products = [], product }) {
	return (
		<Paper style={{ padding: '15px',position:'sticky',top:'0',right:'0',marginLeft:'10px' }}>
			<h3>Sản phẩm tương tự</h3>
			<Grid container spacing={2} style={{ display: 'felx',flexDirection:'column', flexWrap: 'nowrap', overflow: 'auto' }}>
				{products.map((products) =>
					products.category === product.category ? (
						<Grid item key={products._id}>
							<ProductItem key={products._id} product={products} />
						</Grid>
					) : null
				)}
			</Grid>
		</Paper>
	);
}
