import { Paper } from '@material-ui/core';
import React from 'react';
import { Doughnut } from 'react-chartjs-2';

DoughnutChart.propTypes = {};

function DoughnutChart({ list = [], labels = [] }) {
	const data = {
		labels: labels,
		datasets: [
			{
				label: '# of Votes',
				data: list,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	return (
		<Paper style={{ padding: '3rem' }}>
			<div className="header">
				<h4 className="title">Xu hướng</h4>
			</div>
			<Doughnut  data={data} />
		</Paper>
	);
}

export default DoughnutChart;
