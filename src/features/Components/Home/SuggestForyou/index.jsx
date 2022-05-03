import { Grid, Typography } from '@material-ui/core';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import React, { useContext, useEffect, useState } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';
import ProductItem from '../../Products/product';
import BtnLoadMore from './BtnLoadMore';
import axios from 'axios';
function SuggestForYou(props) {
	const [products, setProducts] = useState([]);
	const [limit, setlimit] = useState(20);
	useEffect(() => {
		const getproducts = async () => {
			const res = await axios.get(`/api/products?limit=${limit}`);
			setProducts(res.data.products);
		};
		getproducts();
	}, [limit]);
	const change = () => {
		setlimit((prev) => prev + 20);
	};
	return (
		<XLayout elevation={0} style={{ marginTop: '20px' }}>
			<XLayout_Center item style={{ padding: '20px', backgroundColor: 'white' }}>
				<Typography component="h2" variant="h5" style={{ color: 'rgb(238, 77, 45)', fontSize: '19px' }}>
					Gợi ý cho bạn
				</Typography>
				<Grid className="p-grid p-formgrid p-fluid">
					{products?.map((product) => (
						<ProductItem className="p-col-3" key={product._id} product={product} />
					))}
				</Grid>
				<BtnLoadMore change={change} />
			</XLayout_Center>
		</XLayout>
	);
}

export default SuggestForYou;
