import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';
import { SpeedDial } from 'primereact/speeddial';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
	root: {
		position: 'fixed',
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
}));

function ScrollTop(props) {
	const { children, window } = props;
	const classes = useStyles();

	const trigger = useScrollTrigger({
		target: window ? window() : undefined,
		disableHysteresis: true,
		threshold: 300,
	});

	const handleClick = (event) => {
		const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

		if (anchor) {
			anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	return (
		<Zoom in={trigger}>
			<div onClick={handleClick} role="presentation" className={classes.root}>
				{children}
			</div>
		</Zoom>
	);
}

ScrollTop.propTypes = {
	children: PropTypes.element.isRequired,
	window: PropTypes.func,
};

export default function BackToTop(props) {
	return (
		<div className="card">
				<Button
					model={[]}
					direction="right"
					transitionDelay={80}
					showIcon="pi pi-bars"
					hideIcon="pi pi-times"
					buttonClassName="p-button-outlined"
					onClick={(e) => {
						const anchor = (e.target.ownerDocument || document).querySelector('#back-to-top-anchor');

						if (anchor) {
							anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
						}
					}}
				/>

		</div>
	);
}
