import { Box, Grid } from '@material-ui/core';
import ListAltIcon from '@material-ui/icons/ListAlt';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import React, { useContext, useState, useEffect } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';
import FormatNumber from './../../../utils/formatNumber';
import CardCount from './Card/index';
import DoughnutChart from './Chart/DoughnutChart';
import LineChart from './Chart/LineChart';
import GroupData from './../../../utils/groupData';
import { Chart } from 'primereact/chart';
import { XLayout, XLayout_Center, XLayout_Top } from 'Components/x-layout/XLayout';
import XToolbar from 'Components/x-toolbar/XToolbar';
import { Button } from 'primereact/button';
import { exportTimeSheet } from './exportExcel';
import axios from 'axios';
import Enumeration from './../../../utils/enum';
DarshBoard.propTypes = {};

function DarshBoard({ paymentCheckOut = [], token }) {
	const state = useContext(ContextGlobal);
	const [allProductSold] = state.productsAPI.allProductSold;
	const [allProduct] = state.productsAPI.allProduct;
	const [allUser] = state.userApi.allUser;
	const [categories] = state.categoryApi.category;
	const [paymentsCheckouts, setPaymentsCheckouts] = useState([]);

	const array = [];
	const totalItem = [];
	paymentCheckOut.map((item) => {
		const { cart } = item;
		array.push(cart);
		totalItem.push(item);
	});
	const totalPrice = array.flat(Infinity).reduce((total, item) => {
		return (total += item.price * item.quantity);
	}, 0);

	const countUser = allUser?.filter((item) => item.role === 0);
	const flatarray = array.flat(Infinity);

	let arrayGroupByDate = GroupData(flatarray, 'category');
	const dataNumbers = Object.values(arrayGroupByDate).map((item) => item.reduce((total, i) => (total += i), 0));
	useEffect(() => {
		try {
			const getPayments = async () => {
				const res = await axios.get('/api/paymentsCheckout?limit=1000', { headers: { Authorization: token } });
				setPaymentsCheckouts(res.data.payments);
			};
			getPayments();
		} catch (error) {
			console.log(error);
		}
	}, []);
	const calculatorTotalPrice = () => {
		const _p = [...paymentsCheckouts];
		const p_success = _p.filter((item) => item.state === Enumeration.SUCCESS);
		const _p_cart = [];
		p_success.map((item) => {
			_p_cart.push(...item.cart);
		});
		const price = _p_cart.reduce((total, item) => {
			return (total += item.price * item.quantity);
		}, 0);
		return price;
	};
	const data = [
		{
			backgroundcolor: 'linear-gradient(to right,#0ac282,#0df3a3)',
			id: 2,
			icon: <MonetizationOnIcon />,
			title: 'Tổng thu nhập',
			number: FormatNumber(calculatorTotalPrice()),
		},
		{
			backgroundcolor: 'linear-gradient(to right,#01a9ac,#01dbdf)',
			id: 3,
			icon: <ShoppingCartIcon />,
			title: 'Số đơn hàng',
			number: paymentsCheckouts.length,
		},
		{
			backgroundcolor: 'linear-gradient(to right,#01a9ac,#01dbdf)',
			id: 3,
			icon: <ShoppingCartIcon />,
			title: 'Số đơn hàng thành công',
			number: paymentsCheckouts.filter((item) => item.state === Enumeration.SUCCESS)?.length,
		},
	];

	const [data1, setData1] = useState([]);
	useEffect(() => {
		// handleData();
	}, []);
	const handleData = (type) => {
		const arr = [];
		allProduct?.products?.map((item) => {
			arr.push(item[type]);
		});

		return arr;
	};
	const [chartData] = useState({
		labels: handleData('title'),
		datasets: [
			{
				data: handleData('views'),
				backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
				hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D'],
			},
		],
	});

	const [lightOptions] = useState({
		plugins: {
			legend: {
				labels: {
					color: '#495057',
				},
			},
		},
	});
	return (
		<XLayout>
			<XLayout_Top>
				<XToolbar
					right={() => (
						<Button
							icon="pi pi-file-excel"
							label="Tải thống kê báo cáo"
							onClick={() => exportTimeSheet(allProduct.products)}
						></Button>
					)}
				></XToolbar>
				<Box style={{ display: 'flex' }}>
					{data.map((item) => (
						<Grid item xs={12} sm={6} md={4} lg={4}>
							<CardCount
								backgroundcolor={item.backgroundcolor}
								icon={item.icon}
								title={item.title}
								number={item.number}
							/>
						</Grid>
					))}
				</Box>
			</XLayout_Top>
			<XLayout_Center>
				<div className="p-col-12" style={{ display: 'flex' }}>
					<div className="p-col-6">
						<LineChart payments={totalItem} />
					</div>
					<div className="p-col-6">
						<DoughnutChart list={dataNumbers} labels={categories} />
					</div>
				</div>

				<div className="p-col-12 card flex justify-content-center">
					<Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative' }} />
				</div>
			</XLayout_Center>
		</XLayout>
	);
}

export default DarshBoard;
