import { Container, Paper, Typography } from '@material-ui/core';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ContextGlobal } from './../../../app/ContextGlobal/index';
import { Button } from 'primereact/button';

function Users(props) {
	const state = useContext(ContextGlobal);

	const [users] = state.userApi.allUser;

	return (
		<Paper style={{ height: '100%' }}>
			<Container>
				<Typography variant="h5" component="h2" style={{ padding: '15px' }}>
					Quản lý người dùng
				</Typography>

				<DataTable
					value={users}
					responsiveLayout="scroll"
					className="p-datatable-customers"
					dataKey="_id"
					rowHover
					emptyMessage="No customers found."
					showGridlines
				>
					<Column field="_id" header="Mã người dùng"></Column>
					<Column field="name" header="Tên người dùng"></Column>
					<Column
						body={(d) => (
							<span style={{ color: d.role === 1 && 'red' }}>
								{d.role === 1 ? 'Admin' : 'Người dùng'}
							</span>
						)}
						header="Quyền hạn"
					></Column>
					<Column
						body={(d) => <span>{new Date(d.createdAt).toLocaleDateString()}</span>}
						header="Ngày tạo"
					></Column>
					<Column
						body={(d) => 
							<Link to={`user/details/${d._id}`}>
								<Button label="Xem" color="primary" variant="contained"></Button>
							</Link>
						}
						header="Xem"
					></Column>
				</DataTable>
			</Container>
		</Paper>
	);
}

export default Users;
