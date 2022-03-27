import React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Typography, Box } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import FacebookIcon from '@material-ui/icons/Facebook';
ContactUs.propTypes = {};

function ContactUs(props) {
	return (
		<Container>
			<Grid container style={{ marginTop: '50px' }}>
				<Grid item lg={12} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
					<Typography variant="h3" component="h2">
						Contact Us
					</Typography>
					<Box>
						<Typography
							style={{ border: '1px solid', padding: '10px', textAlign: 'center' }}
							variant="h5"
							component="h3"
						>
							OPENING TIME ONLINE
							<Typography>every day of the week</Typography>
						</Typography>
					</Box>
					<Box>
						<Typography style={{ display: 'flex', alignItems: 'center',marginTop:'10px' }} component="p" variant="subtitle1">
							<PhoneIcon />
							+84 865298986
						</Typography>
						<Typography style={{ display: 'flex', alignItems: 'center',marginTop:'10px' }} component="p" variant="subtitle1">
							<WhatsAppIcon />
							+84 865298986
						</Typography>
						<Typography style={{ display: 'flex', alignItems: 'center',marginTop:'10px' }} component="p" variant="subtitle1">
							<MailOutlineIcon />
							thanhhuyen181020@gmail.com
						</Typography>
						<Typography style={{ display: 'flex', alignItems: 'center',color:'blue',marginTop:'10px' }} component="a" href="https://www.facebook.com/tinushair" variant="subtitle1">
							<FacebookIcon />
							https://www.facebook.com/tinushair
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}

export default ContactUs;
