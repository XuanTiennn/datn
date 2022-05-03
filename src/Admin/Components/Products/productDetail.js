import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { ContextGlobal } from './../../../app/ContextGlobal/index';
import Enumeration from './../../../utils/enum';
import AddProduct from './addProduct';
import ToastNoti from 'utils/ToastNoti';
import { Toast } from 'primereact/toast';
function ProductDetail(prop, ref) {
	const [open, setOpen] = useState(false);
	const [productId, setProductId] = useState();
	const refMode = useRef(null);
	const [payload, setPayload] = useState();
	const state = useContext(ContextGlobal);
	const [token] = state.token;
	const [callback, setCallBack] = state.productsAPI.callback;
	const [images, setImages] = useState(false);
	const toast = useRef(null);
	useImperativeHandle(ref, () => ({
		create: () => {
			setOpen(true);
			refMode.current = Enumeration.crud.create;
		},
		show: (id) => {
			setOpen(true);
			refMode.current = Enumeration.crud.update;
			setProductId(id);
		},
	}));

	const handleAction = async () => {
		let res;
		const _product = { ...payload };
		switch (refMode.current) {
			case Enumeration.crud.create:
				res = await axios.post('/api/products', { ..._product, images }, { headers: { Authorization: token } });
				break;
			case Enumeration.crud.update:
				res = await axios.put(
					`/api/products/${_product._id}`,
					{ ..._product, images },
					{ headers: { Authorization: token } }
				);
				break;
			default:
				break;
		}
		if (res) {
			showSuccess(res.data.mgs);
			setOpen(false);
			setCallBack(!callback);
			// showWarning();
		}
	};
	const showSuccess = (title) => {
		toast.current.show({ 
			severity: 'success', 
			summary: 'Thao tác thành công', 
			detail: title, 
			life: 3000 });
	};
	
	const getPayload = (payload, image) => {
		setPayload(payload);

		setImages(image);
	};
	const onHide = () => {
		setOpen(false);
		setProductId(null);
	};

	const footer = () => {
		return (
			<div>
				<Button label="Hủy" icon="pi pi-times" onClick={() => onHide()} className="p-button-text" />
				<Button label="Lưu" icon="pi pi-check" onClick={() => handleAction()} />
			</div>
		);
	};
	return (
		<div>
			<Toast ref={toast} position='bottom-right' />

			<Dialog
				contentStyle={{ overflowy: 'scroll' }}
				visible={open}
				onHide={onHide}
				footer={footer}
				header={refMode.current === 'create' ? 'Thêm mới sản phẩm' : 'Sửa mới sản phẩm'}
				style={{ width: '55vw', marginLeft: '20px' }}
			>
				<AddProduct getPayload={getPayload} productId={productId} />
			</Dialog>
		</div>
	);
}

ProductDetail = forwardRef(ProductDetail);
export default ProductDetail;
