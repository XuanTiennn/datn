import { Box, Typography } from '@material-ui/core';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import React, { useContext } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';

function FilterByPrice(props) {
	const state = useContext(ContextGlobal);
	const [mode, setmode] = state.productsAPI.mode;
	const [priceTo, setPriceTo] = state.productsAPI.priceTo;

	return (
		<div>
			<Box>
				<Typography variant="body1" component="h2">
					Giá
				</Typography>
				<div>
					<Button
						className="p-button-sm p-button-outlined p-p-1 p-mt-2 p-mb-2"
						label="Cao hơn"
						onClick={() => setmode('gte')}
					></Button>
					<Button
						className="p-button-sm p-button-outlined p-p-1 p-ml-2 p-mt-2 p-mb-2"
						label="Thấp hơn"
						onClick={() => setmode('lte')}
					></Button>
					<InputNumber onChange={(e) => setPriceTo(e.value)} placeholder="Nhập giá" />
				</div>
			</Box>
		</div>
	);
}

export default FilterByPrice;
