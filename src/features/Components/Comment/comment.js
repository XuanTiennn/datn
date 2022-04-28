import axios from 'axios';
import React, { useState } from 'react';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
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
				likes: 0,
			});
			afterSubmit({ ...payload, productId: product._id, userId: state.userApi.user[0] });
			setPayload({ content: '' });
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div>
			<div
				className="p-col-10 p-py-0 p-px-1 p-mt-6 p-p-2"
				style={{ border: '1px solid brown', borderRadius: '5px', width: '100%', textAlign: 'right' }}
			>
				<span className="p-float-label">
					<Rating
						style={{ textAlign: 'left' }}
						value={payload?.rating}
						cancel={false}
						onChange={(e) => applyChange('rating', e.value)}
					/>

					<InputTextarea
						value={payload?.content}
						onChange={(e) => applyChange('content', e.target.value)}
						rows={3}
						cols={5}
						autoResize
						style={{ width: '100%' }}
					/>
				</span>
				<Button className="p-button-outlined p-button-infor" label="Gửi" onClick={createComment}></Button>
			</div>
		</div>
	);
};
export default Comment;
