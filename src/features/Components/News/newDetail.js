import axios from 'axios';
import { XLayout, XLayout_Center, XLayout_Top } from 'Components/x-layout/XLayout';
import React, { useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { ContextGlobal } from './../../../app/ContextGlobal/index';

function NewDetail(props) {
	const { params } = useRouteMatch();
	const [newItem, setNewItem] = useState();
	const state = useContext(ContextGlobal);
	const [token] = state.token;
	useEffect(async () => {
		const res = await axios.get(`/api/news/${params.id}`);
		setNewItem(res.data);
		if (res.data.views) {
			res.data.views += 1;
		} else {
			res.data.views = 1;
		}
		await axios.put(`/api/news/${params.id}`, {
			...res.data,
		});
	}, []);
	function forhtmlContent() {
		return { __html: newItem?.content };
	}
	return (
		<XLayout className="p-p-4" style={{marginTop:'100px'}}>
			<XLayout_Top>
				<h1>{newItem?.title}</h1>
			</XLayout_Top>
			<XLayout_Center className="p-col-9">
				<div dangerouslySetInnerHTML={forhtmlContent()}></div>
			</XLayout_Center>
		</XLayout>
	);
}

export default NewDetail;
