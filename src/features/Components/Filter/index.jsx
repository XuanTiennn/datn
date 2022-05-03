import { Box } from '@material-ui/core';
import React from 'react';
import FilterByCategory from './filterByCategory';
import FilterByColor from './filterByColor';
import FilterByPrice from './filterByPrice';

function Filter(props) {
	return (
		<Box>
			<FilterByCategory />
			<FilterByPrice />
			<FilterByColor />
		</Box>
	);
}

export default Filter;
