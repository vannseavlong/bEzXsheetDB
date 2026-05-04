import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import useDataTableApi from '@/hooks/use-data-table-api';
import CustomerHeader from '@/components/data-table/customer-header';
import { customerColumns } from '@/components/data-table/customer-column';
import { useState } from 'react';
import { ACTIONS, MODULES } from '@/lib/permission';
// import OverviewCard from '@/components/common/overview-card';
// import DateRangePickerV2 from '@/components/common/date-range-picker-v2';
import useExistedCustomerQuery from '@/hooks/query/use-existed-customer-query';
// import { initialDateRange, OverviewDescription } from '@/constants/constants';

export const handle = {
  module: MODULES.MARKETING_CUSTOMER,
  action: ACTIONS.VIEW
};

// const overviews: { label: string; value: string }[] = [
//   {
//     label: 'Total Registered Users',
//     value: 'totalUserRegistered'
//   },
//   {
//     label: 'New Registered Users',
//     value: 'totalNewUserRegistered'
//   },
//   {
//     label: 'Return Customer Rate',
//     value: 'totalReturnCustomerRate'
//   },
//   {
//     label: 'Avg. Order Revenue',
//     value: 'totalAvgOrderRevenue'
//   }
// ];

export default function Customer() {
  const [searchValue, setSearchValue] = useState<string>('');
  const tableState = useTableState();
  const { dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen, pagination, columnFilters } =
    tableState;

  const { data, isPending, isFetching } = useExistedCustomerQuery({
    searchText: searchValue,
    currentPage: pagination.pageIndex,
    pageSize: pagination.pageSize,
    dateRange,
    columnFilters
  });
  const table = useDataTableApi({
    data: data?.data ?? [],
    columns: customerColumns,
    tableState,
    pageCount: data?.pagination.totalPages ?? -1
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-88px)] lg:h-[calc(100vh-88px)] overflow-y-auto p-4 pb-0">
      {/* <div className="flex justify-end pb-4">
        <DateRangePickerV2 {...tableState} />
      </div> */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        {overviews.map((kpi, index) => {
          const overview = (
            data
              ? data[kpi.value as keyof typeof data]
              : {
                  count: 0,
                  trend: 'none',
                  percentage: '0'
                }
          ) as TrendProps;
          return (
            <OverviewCard
              count={overview?.count}
              percentage={overview?.percentage}
              trend={overview?.trend}
              key={index}
              label={kpi.label}
              description={OverviewDescription[kpi.value as keyof typeof OverviewDescription]}
            />
          );
        })}
      </div> */}
      <div className="rounded-md border flex flex-col flex-1 min-h-[300px] lg:min-h-0">
        <CustomerHeader
          dateRange={dateRange}
          setDateRange={setDateRange}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          // initialDateRange={initialDateRange}
          search={searchValue}
          setSearch={setSearchValue}
          table={table}
        />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <DataTableHeader table={table} />
            <TableBody>
              <TableRows
                isLoading={isPending || isFetching}
                columns={customerColumns}
                table={table}
              />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
