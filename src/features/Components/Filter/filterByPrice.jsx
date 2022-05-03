import {
	Box, Typography
} from '@material-ui/core';
import { InputText } from 'primereact/inputtext';
import React, { useContext } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';

function FilterByPrice(props) {
	const state = useContext(ContextGlobal);
	const [service, setService] = state.productsAPI.service;

	return (
		<div>
			<Box>
				<Typography variant="body1" component="h2">
					Giá
				</Typography>
				<InputText placeholder="Từ" />
				<InputText placeholder="Đến" />
			</Box>
		</div>
	);
}

export default FilterByPrice; 
