import { Pagination } from '@material-ui/lab';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
const ListComment = (props) => {
	const { comments, isLogined } = props;

	const [payload, setPayload] = useState({});
	const [page, setPage] = useState(1);
	const toast = useRef(null);

	const [listComment, setlistComment] = useState(comments);
	const applyChange = (prop, value) => {
		const _p = { ...payload };
		_p[prop] = value;
		setPayload(_p);
	};
	const params = useParams();
	const getData = async (page, sort) => {
		let res = await axios.get(`/api/comment/${params.id}?page=${page}&sort=${sort}`);
		setlistComment(res.data);
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
	const sort = () => {
		const _p = { ...listComment };
		_p.comments.sort((a, b) => b.likes - a.likes);
		setlistComment(_p);
	};
	return (
		<div style={{ border: '1px solid #eee', backgroundColor: 'white', padding: '5px', borderRadius: '5px' }}>
			<h5 style={{ fontSize: '26px' }}>Đánh giá nhận xét từ khách hàng</h5>
			<Toast ref={toast} />
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<button
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
				</button>
				<button
					onClick={() => getData(page, '-createdAt')}
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
					<div className="p-ml-3">
						<p>Người đánh giá : {item.userId?.name}</p>
						<span>{item.content}</span>
						<div style={{ display: 'flex', marginTop: '10px' }}>
							<button
								onClick={() => update(item)}
								style={{
									backgroundColor: 'blueviolet',
									color: 'white',
									border: 'none',
									padding: '3px',
									borderRadius: '5px',
									marginLeft: '10px',
									display: 'block',
									cursor: 'pointer',
								}}
							>
								Thích :
							</button>
							<span style={{ color: 'black', marginLeft: '10px' }}>{item.likes}</span>
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
					getData(value);
				}}
			/>
		</div>
	);
};
export default ListComment;
