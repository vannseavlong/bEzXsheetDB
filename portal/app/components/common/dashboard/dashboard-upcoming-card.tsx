import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatFullDate } from '@/lib/date-helper';

type Props = {
  data: UpcomingOrderProps[];
  isLoading: boolean;
};
export default function DashboardUpcomingCard({ data, isLoading }: Props) {
  return (
    <Card className="flex flex-1 min-w-[280px] border gap-0 py-6 overflow-hidden h-[400px]">
      <CardHeader className="px-4">
        <CardTitle>Upcoming Orders</CardTitle>
      </CardHeader>
      {isLoading ? (
        <div className="flex flex-1 p-4 flex-col gap-4">
          <Skeleton className="w-full h-[46px]" />
          <Skeleton className="w-full h-[46px]" />
          <Skeleton className="w-full h-[46px]" />
          <Skeleton className="w-full h-[46px]" />
          <Skeleton className="w-full h-[46px]" />
        </div>
      ) : (
        <CardContent className="px-8 pt-4 pb-0 overflow-y-auto space-y-6">
          {data.map((order, index) => (
            <div key={index} className="flex items-center gap-4 h-[46px]">
              <img
                src={order.thumbnailUrl}
                alt={`Order ${order.bulkOrderId || ''} icon`}
                className="w-[40px] h-[40px] object-cover rounded-full"
              />
              <div className="flex flex-1 flex-col min-w-0">
                <div className="text-sm font-semibold truncate">{order.productOptionV2Name}</div>
                <div className="text-sm text-muted-foreground">
                  {formatFullDate(order.scheduleStartDate)}
                </div>
              </div>
              <span>{order.totalAmount}</span>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  );
}
