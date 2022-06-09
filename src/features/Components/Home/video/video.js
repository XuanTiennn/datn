import React from 'react';
import PropTypes from 'prop-types';

Video.propTypes = {};

function Video(props) {
	return (
		<div className="video">
			<iframe
				width="100%"
				height="500"
				src="https://www.youtube.com/embed/htLA0w9RkHg"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen
			></iframe>
		</div>
	);
}

export default Video;
