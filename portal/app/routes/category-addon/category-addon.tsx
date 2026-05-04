import * as React from 'react';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';
import DataTableHeader from '@/components/data-table/data-table-header';
import { Table, TableBody } from '@/components/ui/table';
import { categoryAddOnColumns } from '@/components/data-table/category-addon-columns';
import CategoryAddonTableHeader from '@/components/category/category-addon-table-header';
import useViewGroupAddonQuery from '@/hooks/query/use-view-group-addon-query';
import TableRows from '@/components/data-table/table-rows';
import { useDeleteProductAddOnGroupMutation } from '@/hooks/mutations/use-delete-product-add-on-group-mutation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

export default function CategoryAddon() {
  const tableState = useTableState();
  const { data: groupAddonData, isPending } = useViewGroupAddonQuery();
  const deleteProductAddOnGroupMutation = useDeleteProductAddOnGroupMutation();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      deleteProductAddOnGroupMutation.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const columns = categoryAddOnColumns({ onDelete: handleDelete });
  const table = useDataTableConfig(groupAddonData ?? [], columns, tableState);

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
        <div className="rounded-md border flex flex-col flex-1 min-h-0">
          <CategoryAddonTableHeader table={table} />
          <div className="flex min-h-0 overflow-hidden">
            <Table className="min-w-full">
              <DataTableHeader table={table} />
              <TableBody>
                <TableRows isLoading={isPending} table={table} columns={columns} />
              </TableBody>
            </Table>
          </div>
        </div>
        <TablePagination table={table} />
      </div>
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Product Add-On Group</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product add-on group? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteProductAddOnGroupMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteProductAddOnGroupMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
