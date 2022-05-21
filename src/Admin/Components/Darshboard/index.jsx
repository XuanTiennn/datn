import { Grid } from '@material-ui/core';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import axios from 'axios';
import { XLayout, XLayout_Center, XLayout_Top } from 'Components/x-layout/XLayout';
import { Chart } from 'primereact/chart';
import React, { useContext, useEffect, useState } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';
import Enumeration from './../../../utils/enum';
import FormatNumber from './../../../utils/formatNumber';
import CardCount from './Card/index';
import DoughnutChart from './Chart/DoughnutChart';
import LineChart from './Chart/LineChart';
import PolarAreaChart from './Chart/polarArea';
DarshBoard.propTypes = {};

function DarshBoard({ paymentCheckOut = [], token }) {
	const state = useContext(ContextGlobal);
	const [allProduct] = state.productsAPI.allProduct;
	const [paymentsCheckouts, setPaymentsCheckouts] = useState([]);

	const array = [];
	const totalItem = [];
	paymentCheckOut.map((item) => {
		const { cart } = item;
		array.push(cart);
		totalItem.push(item);
	});
	const flatarray = array.flat(Infinity);
	const [chart, setChart] = useState({});

	const debound = flatarray.reduce((i, item) => {
		return { ...i, [item.category]: (i[item.category] || 0) + 1 };
	}, {});
	useEffect(() => {
		try {
			const getPayments = async () => {
				const res = await axios.get('/api/paymentsCheckout?limit=1000', { headers: { Authorization: token } });
				setPaymentsCheckouts(res.data.payments);
				setChart(bindData(res.data.payments));
				// console.log(bindData());
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
	const bindData = (data) => {
		const _cart = [];
		data.forEach((i) => {
			_cart.push(...i.cart);
		});

		const r = _cart.reduce((r, i) => {
			return { ...r, [i.title]: (r[i.title] || 0) + 1 };
		}, {});

		return r;
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
			id: 1,
			icon: <ShoppingCartIcon />,
			title: 'Tổng số đơn hàng',
			number: paymentsCheckouts.length,
		},
		{
			backgroundcolor: '#7dc006',
			id: 3,
			icon: <i className="pi pi-bolt" style={{ fontSize: '2em' }}></i>,
			title: 'Số đơn hàng thành công',
			number: paymentsCheckouts.filter((item) => item.state === Enumeration.SUCCESS)?.length,
		},
	];

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
		<XLayout className="p-mt-2">
			<XLayout_Top></XLayout_Top>
			<XLayout_Center>
				<div style={{ display: 'flex' }}>
					<div className="p-col-3 p-ml-2">
						{data.map((item) => (
							<Grid item xs={12} sm={6} md={4} lg={4}>
								<CardCount
									backgroundcolor={item.backgroundcolor}
									icon={item.icon}
									title={item.title}
									number={item.number}
									className="p-mt-2"
								/>
							</Grid>
						))}
					</div>
					<div className="p-col-9" style={{ display: 'flex' }}>
						<div className="p-col-6 p-ml-2">
							<LineChart payments={totalItem} />
							<CardCount
								backgroundcolor={'violet'}
								icon={<i className="pi pi-box" style={{ fontSize: '2em' }}></i>}
								title={'Số sản phẩm'}
								number={allProduct?.products?.length}
								style={{ marginTop: '15px' }}
							/>
						</div>
						<div className="p-col-6">
							<DoughnutChart list={Object.values(debound)} labels={Object.keys(debound)} />
						</div>
					</div>
				</div>
				<div className="p-col-12 card flex justify-content-center">
					<h4>Top sản phẩm bán chạy</h4>
					<PolarAreaChart data={chart} />
				</div>
				<div className="p-col-12 card flex justify-content-center">
					<h4>Top sản phẩm được xem nhiều nhất</h4>
					<Chart type="pie" data={chartData} options={lightOptions} style={{ position: 'relative' }} />
				</div>
			</XLayout_Center>
		</XLayout>
	);
}

export default DarshBoard;
