import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useState, useImperativeHandle, forwardRef, useContext } from 'react';
import { ContextGlobal } from './../app/ContextGlobal/index';
import axios from 'axios';
function ShowConfirmFunction(prop, ref) {
	const { title, action = () => {} } = prop;
	const [open, setOpen] = useState(null);
	const [infor, setInfor] = useState(null);
	const state = useContext(ContextGlobal);
	const [token] = state.token;
	const [callback, setCallBack] = state.productsAPI.callback;
	useImperativeHandle(ref, () => ({
		show: (id, urlImg) => {
			setOpen(true);
			const _infor = { ...infor };
			_infor.id = id;
			_infor.public_id = urlImg;
			setInfor(_infor);
		},
		multiple: (id, urlImg) => {
			setOpen(true);
			const _infor = { ...infor };
			_infor.id = id;
			_infor.public_id = urlImg;
			setInfor(_infor);
		},
	}));
	const onHide = () => {
		setOpen(false);
	};
	const handleAction = () => {
		handleRemove();
		setOpen(false);
	};

	const handleRemove = async () => {
		try {
			if (infor.public_id) {
				const destroy = axios.post(
					'/api/destroy',
					{ public_id: infor.public_id },
					{ headers: { Authorization: token } }
				);
				await destroy;
			}

			const res = axios.delete(`/api/news/${infor.id}`, { headers: { Authorization: token } });

			await res;
			setCallBack(!callback);
		} catch (error) {
			const failr = error.response.data.msg;
			alert(failr);
		}
	};
	const footer = () => {
		return (
			<div>
				<Button label="Hủy" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
				<Button label="Đồng ý" icon="pi pi-check" onClick={() => handleAction()} />
			</div>
		);
	};
	return (
		<div>
			<Dialog visible={open} onHide={onHide} footer={footer} header="Xác nhận">
				{title}
			</Dialog>
		</div>
	);
}
ShowConfirmFunction = forwardRef(ShowConfirmFunction);
export default ShowConfirmFunction;
