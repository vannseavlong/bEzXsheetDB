import * as React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import useTableState from '@/hooks/use-table-state';
import TablePagination from '@/components/common/table-pagination';
import useDataTableConfig from '@/hooks/use-data-table-config';

import BannerHeader from '@/components/common/banner-header';
import { bannerColumns } from '@/components/common/banner-column';
import DraggableContext from '@/components/common/draggable/draggable-context';
import DataTableHeader from '@/components/data-table/data-table-header';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import SortableRows from '@/components/data-table/sortable-rows';
import useBannerQuery from '@/hooks/query/use-banner-query';
import { useNavigate } from 'react-router';
import { useDeleteBannerMutation } from '@/hooks/mutations/use-delete-banner-mutation';
import WarningDialog from '@/components/common/warning-dialog';
import { useBannerRearrangeMutation } from '@/hooks/mutations/use-banner-rearrange-mutation';
import type { UniqueIdentifier } from '@dnd-kit/core';
import { ACTIONS, MODULES } from '@/lib/permission';
import { usePermission } from '@/hooks/use-permission';

export default function Banner() {
  const { hasPermission } = usePermission();
  const canView = hasPermission(MODULES.MARKETING_BANNER, ACTIONS.VIEW);

  const navigate = useNavigate();
  const [searchValue, setSearchValue] = React.useState('');
  const tableState = useTableState();
  const { statusFilter, setStatusFilter } = tableState;
  const deleteBannerMutation = useDeleteBannerMutation();
  const { mutate: rearrangeBanner } = useBannerRearrangeMutation();

  const statusParam = statusFilter === 'all' ? undefined : statusFilter === 'Active' ? '1' : '0';
  const { data: apiData, isPending } = useBannerQuery(undefined, statusParam, searchValue);

  const [orderedData, setOrderedData] = React.useState<BannerProps[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = React.useState<number | null>(null);

  React.useEffect(() => {
    setOrderedData(apiData ?? []);
  }, [apiData]);

  React.useEffect(() => {
    if (deleteBannerMutation.isSuccess) {
      setIsDeleteDialogOpen(false);
      setSelectedDeleteId(null);
    }
  }, [deleteBannerMutation.isSuccess]);

  const columns = React.useMemo(
    () =>
      bannerColumns({
        onEdit: (banner) => navigate(`/banner/new-banner?id=${banner.id}`),
        onDelete: (id) => {
          setSelectedDeleteId(id);
          setIsDeleteDialogOpen(true);
        }
      }),
    [navigate]
  );

  const handleDeleteConfirm = () => {
    if (!selectedDeleteId) return;
    deleteBannerMutation.mutate(selectedDeleteId);
  };

  const table = useDataTableConfig(orderedData, columns, tableState);

  const handleSearchChange = (value: string) => {
    table.setPageIndex(0);
    setSearchValue(value);
  };

  const handleDragChange = (id: UniqueIdentifier, index: number) => {
    rearrangeBanner({ id, sort: index });
  };

  if (!canView) {
    return (
      <div className="flex flex-1 h-full items-center justify-center">
        <span className="text-muted-foreground">No Permission to View</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-88px)] overflow-hidden p-4 pb-0">
      <WarningDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        description="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        isPending={deleteBannerMutation.isPending}
        onConfirm={handleDeleteConfirm}
      />

      <div className="rounded-md border flex flex-col flex-1 min-h-0">
        <BannerHeader
          searchText={searchValue}
          onSearchTextChange={handleSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <DraggableContext data={orderedData} setData={setOrderedData} onChange={handleDragChange}>
          <div className="flex min-h-0 overflow-hidden">
            <Table className="min-w-full">
              <DataTableHeader isDraggable table={table} />

              <TableBody>
                <SortableContext
                  items={orderedData.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <SortableRows isLoading={isPending} table={table} columns={columns} />
                </SortableContext>
              </TableBody>
            </Table>
          </div>
        </DraggableContext>
      </div>

      <TablePagination table={table} />
    </div>
  );
}
