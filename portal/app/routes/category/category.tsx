import * as React from 'react';
import useTableState from '@/hooks/use-table-state';
import useDataTableConfig from '@/hooks/use-data-table-config';
import CategoryTableHeader from '@/components/category/category-table-header';
import DraggableTable from '@/components/common/draggable/draggable-context';
import DataTableHeader from '@/components/data-table/data-table-header';
import { Table, TableBody } from '@/components/ui/table';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableRows from '@/components/data-table/sortable-rows';
import { categoryColumns } from '@/components/data-table/category-columns';
import useCategoryQuery from '@/hooks/query/use-category-query';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { useCategoryRearrangeMutation } from '@/hooks/mutations/use-category-rearrange-mutation';
import { useDeleteCategoryMutation } from '@/hooks/mutations/use-delete-category-mutation';
import TablePagination from '@/components/common/table-pagination';

export default function Category() {
  const { mutate } = useCategoryRearrangeMutation();
  const deleteCategoryMutation = useDeleteCategoryMutation();

  const { data: categoryData, isFetching } = useCategoryQuery();

  const tableState = useTableState();
  const [data, setData] = React.useState<CategoryAttributes[]>([]);

  const columns = React.useMemo(
    () =>
      categoryColumns({
        onDelete: (id) => deleteCategoryMutation.mutate(Number(id))
      }),
    [deleteCategoryMutation]
  );

  const table = useDataTableConfig(data, columns, tableState);
  const { statusFilter, setStatusFilter } = tableState;

  React.useEffect(() => {
    if (categoryData) {
      setData(categoryData);
    }
  }, [categoryData]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      const statusColumn = table.getColumn('status');

      if (statusColumn) {
        const filterValue = statusFilter === 'all' ? undefined : statusFilter === 'active';
        statusColumn.setFilterValue(filterValue);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, table]);

  const handleChange = (id: UniqueIdentifier, index: number) => mutate({ id, sort: index });

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <CategoryTableHeader
          table={table}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        <div className="flex min-h-0 overflow-hidden">
          <DraggableTable data={data} setData={setData} onChange={handleChange}>
            <Table className="min-w-full">
              <DataTableHeader isDraggable table={table} />
              <TableBody>
                <SortableContext
                  items={data.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <SortableRows isLoading={isFetching} table={table} columns={columns} />
                </SortableContext>
              </TableBody>
            </Table>
          </DraggableTable>
        </div>
      </div>
      <TablePagination table={table} />
    </div>
  );
}
