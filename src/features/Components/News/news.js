import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
News.propTypes = {};

function News(props) {
	const [news, setNews] = useState([]);
	const history = useHistory();
	useEffect(async () => {
		const res = await axios.get('/api/news');
		setNews(res.data);
	}, []);
	return (
		<div>
			{news.map((item) => (
				<div onClick={() => history.push(`${item._id}`)}>{item.title}</div>
			))}
		</div>
	);
}

export default News;
