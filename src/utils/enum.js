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
			icon: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649665432/N16_ecommers/icon-phone-s2_sx4hgl.svg',
			href: 'tel:0123456789',
		},
		{
			id: 1,
			icon: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649666200/N16_ecommers/icon-mail-s2_ogeicy.svg',
			href: 'mailto:xtienclone1@gmail.com',
		},
		{
			id: 2,
			icon: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649666377/N16_ecommers/icon-map-s2_r3tsyg.svg',
			href: '',
		},
		{
			id: 3,
			icon: 'https://res.cloudinary.com/dzpks7wzs/image/upload/v1649666353/N16_ecommers/icon-fanpage-s2_hqiomw.svg',
			href: 'https://www.facebook.com/XTComputer',
		},
	],
	states: [
		{ code: 'INIT', name: 'Mới' },
		{ code: 'APPROVE', name: 'Đã duyệt' },
		{ code: 'TRANSPORTING', name: 'Đang giao hàng' },
		{ code: 'SUCCESS', name: 'Giao hàng thành công' },
	],
	INIT: 'INIT',
	APPROVE: 'APPROVE',
	TRANSPORTING: 'TRANSPORTING',
	SUCCESS: 'SUCCESS',
	CANCEL: 'CANCEL',
};

export default Enumeration;
