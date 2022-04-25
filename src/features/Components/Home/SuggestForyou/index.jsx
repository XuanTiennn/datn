import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import ProductItem from '../../Products/product';
import BtnLoadMore from './BtnLoadMore';
import FilterByCategory from './FillterByCategory';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
function SuggestForYou(props) {
	const state = useContext(ContextGlobal);
	const [products] = state.productsAPI.products;
	return (
		<XLayout elevation={0} style={{ marginTop: '20px' }}>
			<XLayout_Center item style={{ padding: '20px' }}>
				<Typography component="h2" variant="h4">
					Gợi Ý Hôm Nay
				</Typography>
				<Box>
					<FilterByCategory />
					<Grid className="p-grid p-formgrid p-fluid">
						{products?.map((product) => (
							<ProductItem className="p-col-3" key={product._id} product={product} />
						))}
					</Grid>
					<BtnLoadMore />
				</Box>
			</XLayout_Center>
		</XLayout>
	);
}

export default SuggestForYou;
