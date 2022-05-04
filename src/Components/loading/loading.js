import React from 'react';
import { ProgressBar } from 'primereact/progressbar';

Loading.propTypes = {};

function Loading({ loading }) {
	if (loading) {
		return <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar>;
	} else return null;
}

export default Loading;
