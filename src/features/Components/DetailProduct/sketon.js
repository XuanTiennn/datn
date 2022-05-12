import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
// import './SkeletonDemo.css';
import { Box, Container } from '@material-ui/core';

export const SkeletonDemo = () => {
	const products = Array.from({ length: 5 });

	const bodyTemplate = () => {
		return <Skeleton></Skeleton>;
	};

	return (
		<Box>
			<Container>
				<div className="grid formgrid">
					<div className="field col-12 md:col-6">
						<h5 className="mt-3">Square</h5>
						<div className="flex align-items-end">
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
							<Skeleton width="100%" height="2rem"  className="mr-2"></Skeleton>
						</div>
					</div>
				</div>
			</Container>
		</Box>
	);
};
