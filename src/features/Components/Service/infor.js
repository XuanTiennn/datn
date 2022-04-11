import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import './infor.scss';
import Enumeration from 'utils/enum';
InforWeb.propTypes = {};

function InforWeb(props) {
	return (
		<div className="infor-web">
			{Enumeration.arrInforIcon.map((item) => (
				<a href={item.href} className="infor-item p-p-0">
					<img className="item-img" src={item.icon} />
				</a>
			))}
		</div>
	);
}

export default InforWeb;
