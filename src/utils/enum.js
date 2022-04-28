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

	responsive: {
		desktop: {
			breakpoint: { max: 3000, min: 1024 },
			items: 1,
			slidesToSlide: 1, // optional, default to 1.
		},
		tablet: {
			breakpoint: { max: 1024, min: 464 },
			items: 1,
			slidesToSlide: 1, // optional, default to 1.
		},
		mobile: {
			breakpoint: { max: 464, min: 0 },
			items: 1,
			slidesToSlide: 1, // optional, default to 1.
		},
	},
	arrInforIcon: [
		{
			id: 0,
			icon: 'pi pi-phone',
			href: 'tel:0123456789',
			command: () => {
				window.location.href = 'tel:0123456789';
			},
		},
		{
			id: 1,
			icon: 'pi pi-envelope',
			href: 'mailto:xtienclone1@gmail.com',
			command: () => {
				window.location.href = 'mailto:xtienclone1@gmail.com';
			},
		},
		{
			id: 2,
			icon: 'pi pi-map-marker',
			href: '',
			command: () => {
				window.location.href = 'https://www.facebook.com';
			},
		},
		{
			id: 3,
			icon: 'pi pi-facebook',
			href: 'https://www.facebook.com/',
			command: () => {
				window.location.href = 'https://www.facebook.com/';
			},
		},
	],
	states: [
		{ code: 'INIT', name: 'Mới' },
		{ code: 'APPROVE', name: 'Đã duyệt' },
		{ code: 'TRANSPORTING', name: 'Đang giao hàng' },
		{ code: 'SUCCESS', name: 'Giao hàng thành công' },
		{ code: 'CANCEL', name: 'Hủy đơn hàng' },
	],
	INIT: 'INIT',
	APPROVE: 'APPROVE',
	TRANSPORTING: 'TRANSPORTING',
	SUCCESS: 'SUCCESS',
	CANCEL: 'CANCEL',
	listButton: [
		{ id: 0, lable: 'Tất cả', search: 'all' },
		{ id: 1, lable: '1 sao', search: 1 },
		{ id: 2, lable: '2 sao', search: 2 },
		{ id: 3, lable: '3 sao', search: 3 },
		{ id: 4, lable: '4 sao', search: 4 },
		{ id: 5, lable: '5 sao', search: 5 },
	],
};

export default Enumeration;
