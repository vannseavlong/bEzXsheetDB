import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import TableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import { productOptionColumns } from '@/components/data-table/product-option-columns';
import ProductOptionHeader from '@/components/data-table/product-option-header';
import useProductOptionListQuery from '@/hooks/query/use-product-option-list-query';

export default function ProductOption() {
  const { data = [] } = useProductOptionListQuery();
  const tableState = useTableState();
  const table = useDataTableConfig(data, productOptionColumns, tableState);
  const { statusFilter, setStatusFilter } = tableState;

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const statusColumn = table.getColumn('status');
      if (statusColumn) {
        statusColumn.setFilterValue(statusFilter === 'all' ? undefined : statusFilter);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, table]);

  const headerProps = {
    table,
    statusFilter,
    setStatusFilter
  };

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <ProductOptionHeader {...headerProps} />
        <div className="flex min-h-0 overflow-hidden">
          <Table className="min-w-full">
            <TableHeader table={table} />
            <TableBody>
              <TableRows columns={productOptionColumns} table={table} />
            </TableBody>
          </Table>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
