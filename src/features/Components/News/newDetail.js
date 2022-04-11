import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { XLayout, XLayout_Center, XLayout_Title, XLayout_Top } from 'Components/x-layout/XLayout';
import axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
NewDetail.propTypes = {};

function NewDetail(props) {
	const  {params}  = useRouteMatch();
    const [newItem,setNewItem]=useState();
	useEffect(async () => {
		const res = await axios.get(`/api/news/${params.id}`);
		setNewItem(res.data);
	}, []);
    function forhtmlContent() {
		return { __html: newItem?.content };
	}
	return (
		<XLayout>
			<XLayout_Top>
				<XLayout_Title>{newItem?.title}</XLayout_Title>
			</XLayout_Top> 
            <XLayout_Center> 
                
               <div dangerouslySetInnerHTML={forhtmlContent()}>

               </div>
            </XLayout_Center>
		</XLayout>
	);
}

export default NewDetail;
