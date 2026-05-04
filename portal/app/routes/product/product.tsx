import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { productColumns } from '@/components/data-table/product-columns';
import ProductHeader from '@/components/data-table/product-header';
import useProductListQuery from '@/hooks/query/use-product-list-query';

export default function Product() {
  const tableState = useTableState();
  const {
    statusFilter,
    dateRange,
    isCalendarOpen,
    setStatusFilter,
    setDateRange,
    setIsCalendarOpen
  } = tableState;

  const statusParam = statusFilter === 'true' ? true : statusFilter === 'false' ? false : undefined;

  const { data: productData = [] } = useProductListQuery({ status: statusParam });
  const table = useDataTableConfig(productData, productColumns, tableState);

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
        <ProductHeader {...headerProps} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows columns={productColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
