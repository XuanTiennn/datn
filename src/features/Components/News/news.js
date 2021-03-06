import axios from 'axios';
import { XLayout, XLayout_Center } from 'Components/x-layout/XLayout';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SkeletonDemo } from './../DetailProduct/sketon';
News.propTypes = {};

function News(props) {
	const [news, setNews] = useState([]);
	const history = useHistory();
	useEffect(async () => {
		const res = await axios.get('/api/news');
		setNews(res.data.reverse());
	}, []);
	if (news?.length === 0) {
		return <SkeletonDemo />;
	} else {
		return (
			<XLayout className="p-p-6" style={{ marginTop: '100px' }}>
				<XLayout_Center>
					{news
						.filter((i) => i.status === true)
						.map((item) => (
							<div
								className="p-col-12 p-grid p-formgrid p-fluid"
								style={{ cursor: 'pointer', fontSize: '18px' }}
								onClick={() => history.push(`news/${item._id}`)}
							>
								<div className="p-col-3">
									<img src={item?.images?.url} />
								</div>
								<div className="p-col-9">
									<h3>{item.title}</h3>
									<p>
										Ngày tạo:{new Date(item.createdAt).toLocaleString()}
										<span className="p-ml-2">Lượt xem :{item.views || 0}</span>
									</p>
								</div>
							</div>
						))}
				</XLayout_Center>
			</XLayout>
		);
	}
}

export default News;
