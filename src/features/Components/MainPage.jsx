import { useContext } from 'react';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Admin from '../../Admin';
import { ContextGlobal } from '../../app/ContextGlobal/index';
import NewDetail from './News/newDetail';
import BackToTop from './BackToTop/index';
import Cart from './Cart/cart';
import CheckoutPayment from './Cart/Checkout';
import ContactUs from './ContactUs/index';
import DetailOrder from './DetailOrder';
import OrderCheckoutDetails from './DetailOrder/OrderCheckout';
import DetailsProduct from './DetailProduct/detailsProduct';
import Footer from './Footer/footer';
import Header from './Header/header';
import HomePage from './Home';
import Quenmatkhau from './Login/quenmatkhau';
import SetPassword from './Login/setPassword';
import News from './News/news';
import NotFound from './NotFound/notFound';
import OderHistory from './OderHistory';
import ListPage from './Products/listPages';
import RegisterEmail from './RegisterEmail';
import InforWeb from './Service/infor';
import User from './UserInfor';
function MainPage() {
	const state = useContext(ContextGlobal);
	const [isAdmin] = state.userApi.isAdmin;
	const [isLogined] = state.userApi.isLogined;
	const match = useRouteMatch();

	return (
		<div>
			<Header />
			{isAdmin ? (
				<Route>
					{isAdmin ? <Redirect to="/admin" /> : null}
					<Route path="/admin" component={Admin} />
				</Route>
			) : (
				<Switch>
					<Route path="/" exact component={HomePage} />
					<Route path="/products" exact component={ListPage} />
					<Route path="/products/:id" exact component={DetailsProduct} />
					<Route path="/cart" exact component={Cart} />
					<Route path="/news" exact component={News} />
					<Route path="/news/:id" exact component={NewDetail} />

					{isLogined ? (
						<>
							<Route path="/checkout/payment" exact component={CheckoutPayment} />
							<Route path="/history" exact component={OderHistory} />
							<Route path="/history/details/:id" exact component={DetailOrder} />
							<Route path="/checkout/details/:id" exact component={OrderCheckoutDetails} />
							<Route path="/user" component={User} />
						</>
					) : (
						'Not found'
					)}
					<Route path="/quenmatkhau" component={Quenmatkhau} />
					<Route path="/contact-us" component={ContactUs} />
					<Route path="/user/resetPassword/:email" component={SetPassword} />

					<Route path="*" component={NotFound} />
				</Switch>
			)}
			{isAdmin ? null : <BackToTop />}
			{isAdmin ? null : <RegisterEmail />}
			{isAdmin ? null : <InforWeb />}
			<Footer />
		</div>
	);
}

export default MainPage;
