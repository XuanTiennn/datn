import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { dataCategoryLeft } from '../../../../data/dataSubmenu';
import { Box, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import ConvertStr from './../../../../utils/convertStr';
import { ContextGlobal } from './../../../../app/ContextGlobal/index';
import axios from 'axios';
CategoryMain.propTypes = {};
const useStyles = makeStyles((theme) => ({
	root: {},
	list: {
		display: 'flex',
		alignItems: 'center',
	},
	items: {
		padding: '10px',
		'&:hover': {
			backgroundColor: '#f0faff',
			borderRadius: '15px',
		},
	},
	item: {
		padding: '10px',
		fontSize: '15px',
		fontWeight: '600',
		textTransform: 'uppercase',
		lineHeight: '15px',
		color: '#3e445a',
		'&:hover': {
			color: '#2bbef9',
			transition: '.3s',
		},
	},
}));
function CategoryMain(props) {
	const classes = useStyles();
	const state = useContext(ContextGlobal);
	
	const [category, setCategory] = state.productsAPI.category;
	const [categories, setCategories] = state.categoryApi.category;
	return (
		<Box className={classes.root}>
			<ul className={classes.list}>
				<li className={classes.items}>
					<Link className={classes.item} to="/">
						Trang chủ
					</Link>
				</li>
				{categories.map((item) => (
					<li className={classes.items} key={item.id}>
						<Link
							className={classes.item}
							to="/products"
							// onClick={() => setCategory('category=' + item.name)}
							onClick={() => setCategory('category=' + ConvertStr(item.name).replace(/\s/g, ''))}

						>
							{item.name}
						</Link>
					</li>
				))}
				<li className={classes.items}>
					<Link className={classes.item} to="/news">
					 	Tin tức
					</Link>
				</li>
			</ul>
		</Box>
	);
}

export default CategoryMain;
