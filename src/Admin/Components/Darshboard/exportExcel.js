import * as excelJS from 'exceljs';
export const exportTimeSheet = async (data, org) => {
	const workbook = new excelJS.Workbook();
	workbook.creator = 'exportTimeSheet';
	workbook.lastModifiedBy = 'exportTimeSheet';
	workbook.created = new Date();
	workbook.modified = new Date();
	const province = [];
	/**
	 * LOAD province
	 */
	let sheet = workbook.addWorksheet();
	//title sheet
	sheet.getRow(1).values = ['Tên sản phẩm', 'Loại', 'Màu', 'Số lượt xem', 'Giá', 'Đã bán', 'Số tiền'];
	//key of data sheet
	sheet.columns = [
		{ key: 'title', width: 50 },
		{ key: 'category', width: 30 },
		{ key: 'color', width: 30 },

		{ key: 'views', width: 10 },
		{ key: 'price', width: 20 },
		{ key: 'sold', width: 10 },
		{ key: 'moneysold', width: 15 },
	];
	let arr = [];
	if (data?.length > 0) {
		data.forEach((item, index) => {
			arr.push({
				...item,
				moneysold: item.sold * item.price,
			});
		});
	}
	sheet.getRow(data?.length).values = ['Tổng:', arr.reduce((total, item) => (total += item.moneysold), 0)];

	sheet.addRows(arr);
	for (let i = 0; i < sheet.columns.length; i++) {
		//header row 1
		sheet.getCell(1, i + 1).style = {
			font: { bold: true },
			border: {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			},
		};
	}
	const row = sheet.getRow(1);
	row.eachCell((cell, rowNumber) => {
		sheet.getColumn(rowNumber).alignment = {
			vertical: 'middle',
			horizontal: 'center',
		};
	});

	const fileBuffer = await workbook.xlsx.writeBuffer();

	var blob = new Blob([fileBuffer], { type: 'applicationi/xlsx' });
	var link = document.createElement('a');
	link.href = window.URL.createObjectURL(blob);
	link.download = `TKBC.xlsx`;
	link.click();
};
