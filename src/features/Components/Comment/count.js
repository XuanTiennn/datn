import React from 'react';
import PropTypes from 'prop-types';
import Enumeration from './../../../utils/enum';
import { Button } from 'primereact/button';

Count.propTypes = {};

function Count({ change }) {
	return (
		<div>
			{Enumeration.listButton.map((item) => (
				<Button
					className="p-button-outlined p-p-2 p-ml-2 p-mr-2"
					style={{ width: '100px' }}
					label={item.lable}
					onClick={() => change(item.search)}
				/>
			))}
		</div>
	);
}

export default Count;
