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

	const items = [
		{
			label: 'Add',
			icon: 'pi pi-pencil',
			command: () => {
				toast.current.show({ severity: 'info', summary: 'Add', detail: 'Data Added' });
			},
		},
		{
			label: 'Update',
			icon: 'pi pi-refresh',
			command: () => {
				toast.current.show({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
			},
		},
		{
			label: 'Delete',
			icon: 'pi pi-trash',
			command: () => {
				toast.current.show({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
			},
		},
		{
			label: 'Upload',
			icon: 'pi pi-upload',
			command: () => {
				window.location.hash = '/fileupload';
			},
		},
		{
			label: 'React Website',
			icon: 'pi pi-external-link',
			command: () => {
				window.location.href = 'https://facebook.github.io/react/';
			},
		},
	];

	return (
		<div className="infor-web">
			<div className="card">
				<div className="speeddial-delay-demo" style={{ position: 'relative', left: '-25px',bottom:'30px', }}>
					<SpeedDial
						model={Enumeration.arrInforIcon}
						direction="right"
						transitionDelay={80}
						showIcon="pi pi-bars"
						hideIcon="pi pi-times"
						buttonClassName="p-button-outlined"
					/>
				</div>
			</div>
		</div>
	);
}

export default InforWeb;
