import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

const PolarAreaChart = ({ data = {} }) => {
	// useEffect(() => {
	// 	bindData();
	// }, []);
	console.log(data);
	const [lightOptions] = useState({
		plugins: {
			legend: {
				labels: {
					color: '#495057',
				},
			},
		},
		scales: {
			r: {
				grid: {
					color: '#ebedef',
				},
			},
		},
	});

	const chartData = {
		datasets: [
			{
				data: Object.values(data),
				backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2'],
				label: 'My dataset',
			},
		],
		labels: Object.keys(data),
       
	};

	return (
		<div className="card flex justify-content-center">
			<Chart
				type="polarArea"
				data={chartData}
				options={lightOptions}
				style={{ position: 'relative', width: '80%' }}
			/>
		</div>
	);
};
export default PolarAreaChart;
