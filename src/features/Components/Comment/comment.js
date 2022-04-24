import axios from 'axios';
import React, { useState } from 'react';
const Comment = (props) => {
	const { product, state, afterSubmit } = props;
	const [payload, setPayload] = useState({});
	const applyChange = (prop, value) => {
		const _p = { ...payload };
		_p[prop] = value;
		setPayload(_p);
	};
	const createComment = async () => {
		try {
			await axios.post('/api/comment', {
				...payload,
				productId: product._id,
				userId: state.userApi.user[0],
				views:0
			});
			afterSubmit({ ...payload, productId: product._id, userId: state.userApi.user[0] });
			setPayload({ content: '' });
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<div className="p-col-10 p-py-0 p-px-1 p-mt-2">
				<span className="p-float-label">
					<textarea
						value={payload?.content}
						onChange={(e) => applyChange('content', e.target.value)}
						rows={3}
						cols={5}
						autoResize
						style={{ width: '80%' }}
					/>
				</span>
				<button label="Gửi" onClick={createComment}>
					Gửi
				</button>
			</div>
		</div>
	);
};
export default Comment;
