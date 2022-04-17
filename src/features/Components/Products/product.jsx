import { Box, makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { default as React } from 'react';
import { Link } from 'react-router-dom';
import FormatNumber from '../../../utils/formatNumber';
import clsx from 'clsx';
ProductItem.propTypes = {
	product: PropTypes.object,
	handleClick: PropTypes.func,
};
const useStyles = makeStyles((theme) => ({
	root: {
		height: '100%',
		[theme.breakpoints.up('sm')]: {
			maxWidth: '222px',
		},
		borderRadius: '0',
		border: '1px solid #edeef5',
	},
	img: {
		maxWidth: '180px',
		maxHeight: '200px',
		margin: '0 auto',
		padding: '15px',
		transition: '.5s',
		'&:hover': {
			transform: 'scale(1.3)',
			transition: '.5s',
		},
	},
	title: {
		fontSize: '14px',
		textOverflow: 'ellipsis',
		fontWeight: '500',
		'&:hover': {
			color: '#233a95',
		},
		textTransform: 'capitalize',
		textTransform: 'capitalize',
		display: '-webkit-box',
		maxWidth: '100%',
		margin: '0 auto',
		lineHeight: 1.5,
		'-webkit-line-clamp': 2,
		'-webkit-box-orient': 'vertical',
		overflow: 'hidden',
	},
	description: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	salePercen: {
		marginLeft: theme.spacing(1),
		color: 'rgb(20, 53, 195)',
		fontWeight: '600',
	},
	price: {
		fontSize: theme.spacing(2) + 2,
		fontWeight: '600',
		color: 'rgb(20, 53, 195)',
	},
}));
function ProductItem({ product = {} }) {
	const classes = useStyles();

	return (
		<Card elevation={0} className={classes.root}>
			<CardActionArea>
				<div style={{ position: 'relative' }}>
					<Link to={`/products/${product._id}`}>
						<CardMedia
							component="img"
							alt="Contemplative Reptile"
							image={product.images.url}
							title="Xem ngay"
							className={classes.img}
						/>
					</Link>
					{product.salePercen > 0 && (
						<div
							className="p-p-2"
							style={{
								position: 'absolute',
								bottom: 0,
								borderRadius: '5px',
								left: 0,
								background:
									'url(https://res.cloudinary.com/dzpks7wzs/image/upload/v1650207563/N16_ecommers/download_nfsewk.svg) no-repeat',
							}}
						>
							<h4 style={{ color: 'rgb(255, 213, 145)' }}>Tiết kiệm: </h4>
							<h5 style={{ color: 'white' }}>
								{FormatNumber((product.price * product.salePercen) / 100)}
							</h5>
						</div>
					)}
				</div>

				<CardContent>
					<Link to={`/products/${product._id}`}>
						<Typography
							gutterBottom
							variant="h4"
							component="h2"
							className={clsx(classes.title, 'font-inter')}
						>
							{product.title}
						</Typography>
					</Link>

					<Typography className={clsx(classes.sold, 'font-dosis')} component="p" variant="body1">
						{product.sold > 0 ? `Đã bán ${product.sold} ` : <br></br>}
					</Typography>
					<Box style={{ display: 'flex' }}>
						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
							className={clsx(classes.price, 'font-dosis')}
						>
							{FormatNumber(product.price - (product.price * product.salePercen) / 100)}
						</Typography>

						<Typography
							variant="body2"
							color="textSecondary"
							component="span"
							className={classes.salePercen}
						>
							{product.salePercen > 0 ? `-${product.salePercen}%` : ''}
						</Typography>
					</Box>
					{product.salePercen > 0 && (
						<Typography style={{ textDecoration: 'line-through',color:'rgb(130, 134, 158)' }}>
							{FormatNumber(product.price)}
						</Typography>
					)}
				</CardContent>
			</CardActionArea>
		</Card>
	);
}

export default ProductItem;
