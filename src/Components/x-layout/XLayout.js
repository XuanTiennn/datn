import './scss/XLayout.scss';
import PropTypes from 'prop-types';
import { useRef } from 'react';

/**
 * get random id
 * @returns random id number
 */
function getRandomId() {
	return Math.round(Math.random() * 10000000);
}

/**
 * prepare css class for layout
 * @param {*} base
 * @param {*} className
 * @param {*} center
 * @param {*} middle
 */
function prepareClass(base, className, center, middle) {
	let _class = [base];
	if (className) _class.push(className);
	if (center) _class.push('x-layout-vertical-center');
	if (middle) _class.push('x-layout-horizontal-middle');
	return _class.join(' ');
}

/**
 * layout wrapper
 * @param {*} props
 */
function XLayout(props) {
	const { className, left, top, bottom, right, style } = props;

	let _top = top || 'auto';
	let _right = right || 'auto';
	let _bottom = bottom || 'auto';
	let _left = left || 'auto';

	let _style = style ? { ...style } : {};
	_style.gridTemplateRows = `${_top} 1fr ${_bottom}`;
	_style.gridTemplateColumns = `${_left} 1fr ${_right}`;

	return <div {...props} className={`x-layout ${className || ''}`} style={_style}></div>;
}

/**
 * layout top
 * @param {*} props
 */
function XLayout_Top(props) {
	const { className, id, center, middle } = props;
	const refId = useRef(getRandomId());

	return (
		<div
			{...props}
			id={id || `x-top-${refId.current}`}
			className={prepareClass('x-layout-top', className, center, middle)}
		></div>
	);
}

/**
 * layout left
 * @param {*} props
 */
function XLayout_Left(props) {
	const { className, id, center, middle } = props;
	const refId = useRef(getRandomId());

	return (
		<div
			{...props}
			id={id || `x-left-${refId.current}`}
			className={prepareClass('x-layout-left', className, center, middle)}
		></div>
	);
}

/**
 * layout right
 * @param {*} props
 */
function XLayout_Right(props) {
	const { className, id, center, middle } = props;
	const refId = useRef(getRandomId());

	return (
		<div
			{...props}
			id={id || `x-right-${refId.current}`}
			className={prepareClass('x-layout-right', className, center, middle)}
		></div>
	);
}

/**
 * layout bottom
 * @param {*} props
 */
function XLayout_Bottom(props) {
	const { className, id, center, middle } = props;
	const refId = useRef(getRandomId());

	return (
		<div
			{...props}
			id={id || `x-bottom-${refId.current}`}
			className={prepareClass('x-layout-bottom', className, center, middle)}
		></div>
	);
}

/**
 * layout center
 * @param {*} props
 */
function XLayout_Center(props) {
	const { className, id, center, middle } = props;
	const refId = useRef(getRandomId());

	return (
		<div
			{...props}
			id={id || `x-center-${refId.current}`}
			className={prepareClass('x-layout-center', className, center, middle)}
		></div>
	);
}

/**
 * layout title
 * @param {*} props
 * @returns
 */
function XLayout_Title(props) {
	const { className } = props;
	return <div {...props} className={`x-layout-title ${className || ''}`}></div>;
}

/**
 * layout box
 * @param {*} props
 * @returns
 */
function XLayout_Box(props) {
	const { className } = props;
	return <div {...props} className={`x-layout-box ${className || ''}`}></div>;
}

/**
 * layout row
 * @param {*} props
 * @returns
 */
function XLayout_Row(props) {
	const { className } = props;
	return <div {...props} className={`x-layout-row ${className || ''}`}></div>;
}

/**
 * sidebar right
 * @param {*} props
 */
function XSidebar_Right(props) {
	const { className, visible } = props;
	return (
		<div
			{...props}
			className={`x-sidebar x-sidebar-right ${visible ? 'x-sidebar-visible' : 'x-sidebar-invisible'} ${
				className || ''
			}`}
		></div>
	);
}

export {
	XLayout,
	XLayout_Top,
	XLayout_Left,
	XLayout_Right,
	XLayout_Bottom,
	XLayout_Center,
	XLayout_Title,
	XLayout_Box,
	XLayout_Row,
	XSidebar_Right,
};
