import axios from 'axios';
import React, { useState } from 'react';
const ListComment = (props) => {
	const { comments = [] } = props;
	console.log(comments);
	const [payload, setPayload] = useState({});
	const applyChange = (prop, value) => {
		const _p = { ...payload };
		_p[prop] = value;
		setPayload(_p);
	};

	return (
		<>
			{Array.isArray(comments) &&
				comments.map((item) => (
					<div>
						<textarea disabled value={item.content} />
					</div>
				))}
		</>
	);
};
export default ListComment;
