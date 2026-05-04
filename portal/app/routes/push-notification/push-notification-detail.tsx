import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { useParams } from 'react-router';
import useAnnouncementDetailQuery from '@/hooks/query/use-announcement-detail-query';
import useAnnouncementUsersQuery from '@/hooks/query/use-announcement-users-query';
import { Table, TableBody } from '@/components/ui/table';
import DataTableHeader from '@/components/data-table/data-table-header';
import TableRows from '@/components/data-table/table-rows';
import TablePagination from '@/components/common/table-pagination';
import useDataTableApi from '@/hooks/use-data-table-api';
// import { customerColumns } from '@/components/data-table/customer-column';
import useTableState from '@/hooks/use-table-state';
import { initialDateRange } from '@/constants/constants';
import ContentWrapper from '@/components/common/content-wrapper';
import { announcementUserColumns } from '@/components/data-table/announcement-user-column';

export default function PushNotificationDetail() {
  const { id } = useParams<{ id: string }>();
  // console.log('id:', id);
  const tableState = useTableState(initialDateRange);
  const { pagination } = tableState;

  const { data: announcementDetail, isPending } = useAnnouncementDetailQuery(id || '');
  const {
    data: announcementUsers,
    isPending: isPendingAU,
    isFetching: isFetchingAU
  } = useAnnouncementUsersQuery(id || '', pagination.pageIndex);
  // console.log('announcementDetail: ', announcementDetail);
  // console.log('announcementUsers: ', announcementUsers);

  const table = useDataTableApi({
    data: announcementUsers?.data ?? [],
    columns: announcementUserColumns,
    tableState,
    pageCount: announcementUsers?.pagination.totalPages ?? -1
  });

  return (
    <div className="">
      <CustomHeader isLoading={isPending} />
      <ContentWrapper className="flex items-baseline gap-6 p-6">
        <div className="flex flex-col w-full gap-6">
          <Card>
            <CardContent className="space-y-2">
              <p>
                <b>Name:</b> {announcementDetail?.name}
              </p>
              <p>
                <b>Title:</b> {announcementDetail?.titleEn}
              </p>
              <p>
                <b>Content:</b> {announcementDetail?.contentEn}
              </p>
              <p>
                <b>Target:</b> {announcementDetail?.topics?.map((topic) => topic.name).join(', ')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-base">Users Reached</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="px-6">
              <div className="rounded-md border flex flex-col flex-1 min-h-0">
                <div className="flex min-h-0 overflow-hidden">
                  <Table className="min-w-full">
                    <DataTableHeader table={table} />
                    <TableBody>
                      <TableRows
                        isLoading={isPendingAU || isFetchingAU}
                        columns={announcementUserColumns}
                        table={table}
                      />
                    </TableBody>
                  </Table>
                </div>
              </div>
              <TablePagination table={table} />
            </CardContent>
          </Card>
        </div>
      </ContentWrapper>
    </div>
  );
}
