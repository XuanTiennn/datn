import { Box, Grid } from '@material-ui/core';
import axios from 'axios';
import { XLayout, XLayout_Center, XLayout_Left, XLayout_Right } from 'Components/x-layout/XLayout';
import { default as React, useContext, useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Products from '../Admin/Components/Products/products';
import { ContextGlobal } from '../app/ContextGlobal';
import Category from './Components/Category';
import DarshBoard from './Components/Darshboard';
import DetailsOrderdCheckout from './Components/DetailsOrderd/detailsCheckout';
import Links from './Components/List-links';
import OrderedCheckout from './Components/Odered/orderedCheckout';
import AddProduct from './Components/Products/addProduct';
import Slider from './Components/Slider';
import Users from './Components/Users';
// import '../Components/layout.scss'
import News from './Components/News/news';
import UserInfor from './Components/Users/userInfor';
Admin.propTypes = {};

function Admin(props) {
	const { url } = useRouteMatch();
	const state = useContext(ContextGlobal);
	const [PaymentCheckout, setPaymentCheckout] = useState([]);

	const [paymentsCheckouts,setPaymentsCheckouts] = state.paymentCheckOutApi.paymentsCheckouts;
	const [page, setPage] = useState(1);
	const [token] = state.token;
	useEffect(() => {
		try {
			const getpayment = async () => {
				const res = await axios.get(`/api/paymentsCheckout?page=${page}`, {
					headers: { Authorization: token },
				});
				setPaymentCheckout(res.data.payments);
			};
			getpayment();
		} catch (error) {
			console.log(error);
		}
	}, [page]);
	// console.log(url);
	const aftersubmit = (arr) => {
		setPaymentsCheckouts(arr);
	};
	if (url === '/admin') {
		import('../Components/layout.scss');
	}
	console.log(url);
	return (
		<XLayout>
			<XLayout_Left>
				<Links />

				{/* <MainMenu></MainMenu> */}
			</XLayout_Left>
			<XLayout_Center style={{ height: '100%' }}>
				<Switch>
					<Route path={`${url}/products`} component={Products} />
					<Route path={`${url}/category`} component={Category} />
					<Route path={`${url}/addproduct`} component={AddProduct} />
					<Route path={`${url}/slider`} component={Slider} />
					<Route path={`${url}/users`} component={Users} />
					<Route path={`${url}/news`} component={News} />
					{/* <Route path={`${url}/ordered/:id`} component={DetailsOrderd} /> */}
					<Route path={`${url}/orderdCheckout/:id`}>
						<DetailsOrderdCheckout token={token} paymentsCheckOut={PaymentCheckout} />
					</Route>
					{/* <Route path={`${url}/orderd`} component={Ordered} /> */}
					<Route path={`${url}/orderdCheckout`}>
						<OrderedCheckout
							paymentsCheckout={PaymentCheckout}
							aftersubmit={aftersubmit}
							page={page}
							handleChangePagination={(value) => setPage(value)}
						/>
					</Route>
					<Route path={`${url}/user/details/:id`}>
						<UserInfor token={token} />
					</Route>
					<Route path={`${url}/:id`} component={AddProduct} />
					<Route path={`${url}`} component={DarshBoard}>
						<DarshBoard paymentCheckOut={paymentsCheckouts.payments} />
					</Route>
				</Switch>
			</XLayout_Center>
		</XLayout>
	);
}

export default Admin;
