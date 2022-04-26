import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './comment.scss';
import { Button } from 'primereact/button';
import Count from './count';
const ListComment = (props) => {
	const { comments, isLogined, onPage } = props;

	const [payload, setPayload] = useState({});
	const [page, setPage] = useState(1);
	const [search, setsearch] = useState();
	const [star, setstar] = useState();
	const toast = useRef(null);

	const [listComment, setlistComment] = useState(comments);
	useEffect(() => {
		setlistComment(comments);
	}, [comments]);
	const applyChange = (prop, value) => {
		const _p = { ...payload };
		_p[prop] = value;
		setPayload(_p);
	};
	console.log(listComment);
	const params = useParams();
	const getData = async (page, sort, rating) => {
		let res;
		setsearch(sort);
		setstar(rating);
		if (rating === 'all') {
			res = await axios.get(`/api/comment/${params.id}?page=1`);
		} else if (rating === 'pagi') {
			res = await axios.get(`/api/comment/${params.id}?page=${page}&sort=${search || ''}`);
		} else {
			res = await axios.get(`/api/comment/${params.id}?page=${page}&sort=${search || ''}&rating=${rating}`);
		}
		setlistComment(res.data);
		onPage(res.data);
	};
	const update = async (item) => {
		if (!isLogined) {
			showWarning();
		} else {
			item.likes = item.likes + 1;
			await axios.put(`/api/comment/${item._id}`, { ...item });
			const _p = { ...listComment };
			for (let i = 0; i < _p.comments.length; i++) {
				if (_p.comments[i]._id === item._id) {
					_p.comments[i] = item;
				}
			}
			setlistComment(_p);
		}
	};
	const showWarning = () => {
		toast.current.show({
			severity: 'warn',
			summary: 'Thao tác thất bại',
			detail: 'Vui lòng đăng nhập để thực hiện hành động này !',
			life: 3000,
		});
	};
	const onChange = (search) => {
		console.log(search);
		getData(page, '', search);
	};
	return (
		<div style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
			<h5 style={{ fontSize: '26px' }}>ĐÁNH GIÁ SẢN PHẨM</h5>
			<Count change={onChange} />
			<Toast ref={toast} />
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				{/* <button
					onClick={() => sort()}
					style={{
						backgroundColor: 'white',
						color: 'black',

						padding: '3px',
						borderRadius: '5px',
						marginLeft: '10px',
						display: 'block',
					}}
				>
					Tương tác nhiều nhất
				</button> */}
				<button
					onClick={() => getData(page, '-createdAt','pagi')}
					style={{
						backgroundColor: 'white',
						color: 'black',

						padding: '3px',
						borderRadius: '5px',
						marginLeft: '10px',
						display: 'block',
					}}
				>
					Mới nhất
				</button>
			</div>
			{Array.isArray(listComment.comments) &&
				listComment.comments.map((item) => (
					<div className="p-ml-3 comment">
						<p>Người đánh giá : {item.userId?.name}</p>
						<Rating readOnly value={item?.rating} cancel={false} />
						<p>{new Date(item.createdAt).toLocaleString()}</p>
						<span>{item.content}</span>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<Button
								onClick={() => update(item)}
								className="p-button-outlined"
								style={{
									fontSize: '12px',
									padding: '3px',
									borderRadius: '5px',
									marginLeft: '10px',
									display: 'block',
									cursor: 'pointer',
								}}
								label="	Hữu ích"
							>
								<span style={{ fontWeight: '500', marginLeft: '10px' }}>{item.likes}</span>
							</Button>
						</div>{' '}
					</div>
				))}
			<Pagination
				count={Math.ceil(listComment.total / 9)}
				color="primary"
				page={page}
				className="p-mt-2"
				onChange={(e, value) => {
					setPage(value);
					getData(value, '', 'pagi');
				}}
			/>
		</div>
	);
};
export default ListComment;
