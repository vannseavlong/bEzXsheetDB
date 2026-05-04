import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { useEffect, useState } from 'react';
import { ArrowLeft01Icon } from 'hugeicons-react';
import useCustomerRatingQuery from '@/hooks/query/use-customer-rating-query';
import StarRating from '../star-rating';
import { formatDate } from '@/lib/date-helper';

export default function CustomerReviewDrawer({
  children,
  userId
}: {
  children: React.ReactNode;
  userId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useCustomerRatingQuery({ userId });

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  return (
    <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="w-full sm:w-[400px] rounded-lg overflow-hidden m-4 h-[calc(100vh-2rem)] bg-transparent">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <DrawerHeader className="flex flex-row items-center pb-4 flex-none">
            <Button variant="link" size="sm" onClick={() => setIsOpen(false)}>
              <ArrowLeft01Icon className="!size-6" />
            </Button>
            <DrawerTitle className="text-lg font-semibold">Overall Rating</DrawerTitle>
          </DrawerHeader>

          {/* Scrollable Content Wrapper */}
          <div className="p-4 flex flex-col flex-1 min-h-0 w-full gap-4">
            <span className="font-semibold">History</span>

            {/* Scrollable List */}
            <div className="flex flex-col gap-4 overflow-y-auto flex-1 min-h-0">
              {(data || [])?.map((item, index) => (
                <div key={index} className="flex flex-col gap-2 rounded-lg p-4 border">
                  <div className="flex justify-between">
                    <StarRating count={Number(item.star)} />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  <span className="text-gray-500">Remarks</span>
                  <span>{item.feedback}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
