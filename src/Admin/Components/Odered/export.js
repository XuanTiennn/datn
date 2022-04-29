import * as excelJS from 'exceljs';
import Enumeration from './../../../utils/enum';
import FormatNumber from './../../../utils/formatNumber';
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
	sheet.getRow(1).values = [
		'Payment ID',
		'Nguời nhận hàng',
		'Địa chỉ',
		'Số điện thoại',
		'Số lượng',
		'Số tiền',
		'Phần trăm giảm giá',
		'Ngày đặt hàng',
		'Trạng thái',
	];
	//key of data sheet
	sheet.columns = [
		{ key: '_id', width: 20 },
		{ key: 'name', width: 20 },
		{ key: 'address', width: 30 },
		{ key: 'phone', width: 10 },
		{ key: 'quantity', width: 10 },
		{ key: 'price', width: 15 },
		{ key: 'salePercen', width: 10 },
		{ key: 'createdAt', width: 20 },
		{ key: 'state', width: 20 },
	];
	let arr = [];
	console.log(data);
	if (data?.length > 0) {
		data.forEach((item, index) => {
			arr.push({
				...item,
				createdAt: new Date(item.createdAt).toLocaleString(),
				quantity: item?.cart.reduce((r, item) => (r += item.quantity), 0),
				price: FormatNumber(Number(item?.cart.reduce((r, item) => (r += item.price), 0))),
				salePercen: item?.cart.reduce((r, item) => (r += Number(item.salePercen)), 0),
				state: Enumeration.states.find((i) => i.code === item.state)?.name,
				totalMoney: item?.cart.reduce(
					(r, item) => (r += Number(item.quantity) * (Number(item.price) - Number(item.salePercen * 0.01))),
					0
				),
			});
		});
	}
	sheet.addRows(arr);
	// sheet.insertRow(11, {id: 1, name: 'John Doe', dob: new Date(1970,1,1)});
	sheet.getCell(`F${data.length + 2}`).value = FormatNumber(
		arr.reduce((total, item) => (total += item.totalMoney), 0)
	);
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
