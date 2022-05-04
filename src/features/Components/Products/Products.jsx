import { Box, Container, Grid, Paper } from '@material-ui/core';
import Loading from 'Components/loading/loading';
import { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ContextGlobal } from '../../../app/ContextGlobal';
import BreadCrumb from '../BreadCrumb';
import FilterBySort from '../Filter/filterBySort';
import PaginationPr from '../Pagination';
import Filter from './../Filter/index';
import ProductItem from './product';

function Products(props) {
	const data = useContext(ContextGlobal);
	const [products] = data.productsAPI.products;
	const [page, setPage] = data.productsAPI.page;
	const [category] = data.productsAPI.category;
	const [color, setColor] = data.productsAPI.color;
	const [priceTo, setPriceTo] = data.productsAPI.priceTo;
	const [loading, setloading] = data.productsAPI.loading;

	const match = useRouteMatch();
	useEffect(() => {
		window.scrollTo(0, 0);
		if (match.url === '/products') {
			setPage(1);
			setColor('');
			setPriceTo(9999999999999);
		}
	}, [match.url, category]);
	console.log(products);
	// if (products.length === 0) {
	// 	return <Loading loading={loading} />;
	// } else {
		return (
			<Container style={{ marginTop: '50px', marginBottom: '50px' }}>
				<BreadCrumb str={match.url} category={category.split('=').pop()} />

				<Paper elevation={0}>
					<Grid container spacing={4} style={{ padding: '15px' }}>
						<Grid item lg={3}>
							<Filter />
						</Grid>
						<Grid item lg={9}>
							<FilterBySort />

							<Grid container spacing={0}>
								{products.map((product) => (
									<Grid key={product._id} item xs={12} sm={6} md={4} lg={3}>
										<ProductItem product={product} />
									</Grid>
								))}
							</Grid>
						</Grid>
					</Grid>
				</Paper>
				<Box style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
					<PaginationPr />
				</Box>
			</Container>
		);
	}
// }

export default Products;
