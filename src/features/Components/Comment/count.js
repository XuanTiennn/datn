import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import React from 'react';
import Enumeration from './../../../utils/enum';

Count.propTypes = {};

function Count({ change, count, total }) {
	return (
		<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="p-p-2">
			<div style={{textAlign:'center'}}>
				<p style={{ color: '#ee4d2d' }}>
					<span style={{ fontSize: '22px' }}>{total}</span> trên 5
				</p>
				<Rating style={{ color: '#ee4d2d' }} readOnly value={total} cancel={false} />
			</div>
			{Enumeration.listButton.map((item, index) => (
				<>
					<Button
						className="p-button-outlined p-p-1 p-ml-2 p-mr-2"
						style={{ width: '100px' }}
						label={item.lable}
						onClick={() => change(item.search)}
						badge={index !== 0 && `(${count[index] || 0})`}
					/>
				</>
			))}
		</div>
	);
}

export default Count;
