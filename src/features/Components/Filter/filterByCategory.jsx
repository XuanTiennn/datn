import { Box, FormControl, FormLabel, makeStyles, Radio, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { Checkbox } from 'primereact/checkbox';
import React, { useContext, useEffect, useState } from 'react';
import { ContextGlobal } from '../../../app/ContextGlobal';
FilterByCategory.propTypes = {};

const useStyles = makeStyles({
	root: {
		'&:hover': {
			backgroundColor: 'transparent',
		},
	},
	icon: {
		borderRadius: '50%',
		width: 16,
		height: 16,
		boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
		backgroundColor: '#f5f8fa',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
		'$root.Mui-focusVisible &': {
			outline: '2px auto rgba(19,124,189,.6)',
			outlineOffset: 2,
		},
		'input:hover ~ &': {
			backgroundColor: '#ebf1f5',
		},
		'input:disabled ~ &': {
			boxShadow: 'none',
			background: 'rgba(206,217,224,.5)',
		},
	},
	checkedIcon: {
		backgroundColor: '#137cbd',
		backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
		'&:before': {
			display: 'block',
			width: 16,
			height: 16,
			backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
			content: '""',
		},
		'input:hover ~ &': {
			backgroundColor: '#106ba3',
		},
	},
});
function StyledRadio(props) {
	const classes = useStyles();

	return (
		<Radio
			className={classes.root}
			disableRipple
			color="default"
			checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
			icon={<span className={classes.icon} />}
			{...props}
		/>
	);
}
function FilterByCategory(props) {
	const state = useContext(ContextGlobal);
	const [categories] = state.categoryApi.category;
	const [category, setCategory] = state.productsAPI.category;
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		if (!flag) {
			const arr = [];
			arr.push(category.slice(category.indexOf('=') + 1));
			setSelectedCategories(arr);
		}
	}, [category]);
	const onCategoryChange = async (e) => {
		setFlag(true);
		let _selectedCategories = [...selectedCategories];

		if (e.checked) {
			_selectedCategories.push(e.value.name);
		} else {
			for (let i = 0; i < _selectedCategories.length; i++) {
				const selectedCategory = _selectedCategories[i];

				if (selectedCategory === e.value.name) {
					_selectedCategories.splice(i, 1);
					break;
				}
			}
		}

		setSelectedCategories(_selectedCategories);
		setCategory(`category=${_selectedCategories}`);
	};
	return (
		<div>
			<Box>
				<FormControl component="fieldset">
					<FormLabel component="legend">
						<Typography style={{ fontSize: '16px' }} component="h2">
							Categories
						</Typography>
					</FormLabel>

					{categories.map((category) => {
						return (
							<div
								key={category.name}
								className="field-checkbox"
								style={{ display: 'flex', alignItems: 'center' }}
							>
								<Checkbox
									className="p-m-1"
									inputId={category.name}
									name="category"
									value={category}
									onChange={onCategoryChange}
									checked={selectedCategories.some((item) => item === category.name)}
								/>
								<label htmlFor={category.name}>{category.name}</label>
							</div>
						);
					})}
				</FormControl>
			</Box>
		</div>
	);
}

export default FilterByCategory;
