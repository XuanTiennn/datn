import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'primereact/button';
import './infor.scss';
import Enumeration from 'utils/enum';
import { SpeedDial } from 'primereact/speeddial';
import { Tooltip } from 'primereact/tooltip';
import { Toast } from 'primereact/toast';
InforWeb.propTypes = {};

function InforWeb(props) {
	const toast = useRef(null);

	return (
		<div className="infor-web">
			<div className="card">
				<div className="speeddial-delay-demo" style={{ position: 'relative', left: '-25px', bottom: '30px' }}>
					{/* <SpeedDial
						model={Enumeration.arrInforIcon}
						direction="right"
						transitionDelay={80}
						showIcon="pi pi-bars"
						hideIcon="pi pi-times"
						buttonClassName="p-button-outlined"
					/> */}
					<Button
						onClick={() =>
							(window.location.href =
								'https://api.whatsapp.com/send/?phone=84383302638&text&app_absent=0')
						}
					>
						<i className="pi pi pi-whatsapp" style={{ fontSize: '2em' }}></i>
					</Button>
				</div>
			</div>
		</div>
	);
}

export default InforWeb;
