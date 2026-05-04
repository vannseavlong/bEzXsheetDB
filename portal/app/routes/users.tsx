// import * as React from 'react';
// import { Table, TableBody } from '@/components/ui/table';
// import useTableState from '@/hooks/use-table-state';
// import UserHeader from '@/components/data-table/user-header';
// import TablePagination from '@/components/common/table-pagination';
// import useDataTableConfig from '@/hooks/use-data-table-config';
// import { userColumns } from '@/components/data-table/user-columns';
// import TableHeader from '@/components/data-table/data-table-header';
// import TableRows from '@/components/data-table/table-rows';
// import { userData } from '@/constants/data-dummy';

// export default function User() {
//   const tableState = useTableState();
//   const table = useDataTableConfig(userData, userColumns, tableState);
//   const {
//     statusFilter,
//     dateRange,
//     isCalendarOpen,
//     setStatusFilter,
//     setDateRange,
//     setIsCalendarOpen
//   } = tableState;

//   // Optimized status filter effect with debouncing
//   React.useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       const statusColumn = table.getColumn('status');
//       if (statusColumn) {
//         statusColumn.setFilterValue(statusFilter === 'all' ? undefined : statusFilter);
//       }
//     }, 100); // Small debounce to prevent excessive filtering

//     return () => clearTimeout(timeoutId);
//   }, [statusFilter, table]);

//   const headerProps = {
//     table,
//     statusFilter,
//     setStatusFilter,
//     dateRange,
//     setDateRange,
//     isCalendarOpen,
//     setIsCalendarOpen
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
//       <div className="rounded-md border flex flex-col flex-1 min-h-0">
//         <UserHeader {...headerProps} />
//         <div className="flex min-h-0 overflow-hidden">
//           <Table className="min-w-full">
//             <TableHeader table={table} />
//             <TableBody>
//               <TableRows columns={userColumns} table={table} />
//             </TableBody>
//           </Table>
//         </div>
//       </div>
//       <TablePagination table={table} />
//     </div>
//   );
// }

import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import UserHeader from '@/components/data-table/user-header';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import { userColumns } from '@/components/data-table/user-columns';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { userData } from '@/constants/data-dummy';

export default function User() {
  const tableState = useTableState();
  const table = useDataTableConfig(userData, userColumns, tableState);
  const {
    statusFilter,
    dateRange,
    isCalendarOpen,
    setStatusFilter,
    setDateRange,
    setIsCalendarOpen
  } = tableState;

  // Optimized status filter effect with debouncing
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const statusColumn = table.getColumn('status');
      if (statusColumn) {
        statusColumn.setFilterValue(statusFilter === 'all' ? undefined : statusFilter);
      }
    }, 100); // Small debounce to prevent excessive filtering

    return () => clearTimeout(timeoutId);
  }, [statusFilter, table]);

  const headerProps = {
    table,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    isCalendarOpen,
    setIsCalendarOpen
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <UserHeader {...headerProps} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows columns={userColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
