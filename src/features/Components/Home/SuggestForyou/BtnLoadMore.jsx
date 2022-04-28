import { Button } from '@material-ui/core';
import React, { useContext } from 'react';
import { ContextGlobal } from '../../../../app/ContextGlobal';

BtnLoadMore.propTypes = {};

function BtnLoadMore({change}) {

	return (
		<div style={{display:'flex',justifyContent:'center',marginTop:'30px'}}>
			<Button variant="outlined" color="primary" onClick={(e) => change()}>
				Xem thêm
			</Button>
		</div>
	);
}

export default BtnLoadMore;
