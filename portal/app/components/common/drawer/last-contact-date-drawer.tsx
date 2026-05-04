import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { useEffect, useState } from 'react';
import { ArrowLeft01Icon, Call02Icon } from 'hugeicons-react';
import { formatDate } from '@/lib/date-helper';
import { useLastContactDateQuery } from '@/hooks/query/use-last-contact-date-query';
import type { Row } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarFallbackText } from '@/lib/utils';
import TableCellDiv from '@/components/data-table/table-cell-div';
import clsx from 'clsx';

export default function LastContactDateDrawer({
  children,
  userId,
  row
}: {
  children: React.ReactNode;
  userId: string;
  row: Row<CustomerAttributes>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useLastContactDateQuery(userId);

  console.log({ data });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // return <div>dasdsds</div>;

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="w-full sm:w-[400px] rounded-lg overflow-hidden m-4 h-[calc(100vh-2rem)] bg-transparent">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <DrawerHeader className="flex flex-row items-center pb-2 flex-none">
            <Button variant="link" size="sm" onClick={() => setIsOpen(false)}>
              <ArrowLeft01Icon className="!size-6" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">Last Contacted Date</DrawerTitle>
          </DrawerHeader>
          <div className="w-full h-[1px] bg-gray-200"></div>
          <div className="flex gap-4 p-4 items-center">
            <Avatar className="size-12">
              <AvatarImage />
              <AvatarFallback>{getAvatarFallbackText(row.original.firstName)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">
                {row.original.firstName} {row.original.lastName}
              </span>
              <span className="text-gray-400 text-sm">{row.original.username}</span>
            </div>
            <SpenderType type={row.original.spenderCategory} />
          </div>
          <div className="w-full h-[1px] bg-gray-200"></div>

          {/* Scrollable Content Wrapper */}
          <div className="p-4 flex flex-col flex-1 min-h-0 w-full gap-4">
            <span className="font-semibold">Last Contacted Date</span>

            {/* Scrollable List */}
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
              {(data || [])?.map((item, index) => (
                <div key={index} className="flex flex-col rounded-lg p-4 border gap-2">
                  <div className="flex gap-4 items-center">
                    <div className="w-11 h-11 rounded-sm border items-center justify-center flex">
                      <Call02Icon className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {formatDate(item.lastContactDate)}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {item.customerService.firstName} {item.customerService.lastName}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-sm">Remarks</span>
                  <span className="text-sm">{item.remark}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const SpenderType = ({ type }: { type: string }) => {
  const spenderType = type.split(' ')[0].toLowerCase();
  return (
    <TableCellDiv
      className={clsx('px-3 py-2 rounded-sm', {
        'bg-success/10': spenderType === 'high',
        'bg-primary/10': spenderType === 'medium',
        'bg-destructive/10': spenderType === 'low'
      })}
    >
      <span
        className={clsx('font-semibold', {
          'text-success': spenderType === 'high',
          'text-primary': spenderType === 'medium',
          'text-destructive': spenderType === 'low'
        })}
      >
        {type}
      </span>
    </TableCellDiv>
  );
};
