const Enumeration = {
	locales: [
		{ id: 'vi', name: 'Tiếng Việt' },
		{ id: 'en', name: 'English' },
	],
	crud: {
		create: 'create',
		read: 'read',
		update: 'update',
		copy: 'copy',
		delete: 'delete',
		none: 'none',
		status: {
			active: {
				code: 1,
				name: 'boolean.status.1',
			},
			denied: {
				code: 0,
				name: 'boolean.status.0',
			},
		},
	},
	color_product: [
		{ code: 'do', name: 'Đỏ' },
		{ code: 'xanh', name: 'Xanh' },
		{ code: 'den', name: 'Đen' },
		{ code: 'vang', name: 'Vàng' },
		{ code: 'trang', name: 'Trắng' },
		{ code: 'tim', name: 'Tím' },
	],
	status_product: [
		{ code: true, name: 'Còn hàng' },
		{ code: false, name: 'Hết hàng' },
	],
};

export default Enumeration;
