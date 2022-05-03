import { Container } from '@material-ui/core';
import React, { useEffect } from 'react';
import Banner from '../Banner';
import SalePrice from './SalePrices';
import SuggestForYou from './SuggestForyou';
import Thumbnails from './Thumnails';
import TopTrending from './TopTrendingCate';

HomePage.propTypes = {};

function HomePage(props) {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);
	return (
		<>
			<Banner />
			<Container>
				<Thumbnails />

				<TopTrending />
				<SalePrice />
				<SuggestForYou />
			</Container>
		</>
	);
}

export default HomePage;
