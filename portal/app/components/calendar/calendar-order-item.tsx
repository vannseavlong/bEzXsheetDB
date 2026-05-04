import { formatFullDate } from '@/lib/date-helper';
import { ChevronRight } from 'lucide-react';
import moment from 'moment';

type Props = {
  order: OrderListAttributes;
  endTime?: boolean;
  onClick?: () => void;
};

export default function CalendarOrderItem({ order, endTime = false, onClick }: Props) {
  return (
    <div className="flex items-center gap-4 py-1 cursor-pointer" onClick={onClick}>
      <img
        src={order.thumbnailUrl}
        alt={`Order ${order.bulkOrderId || ''} icon`}
        className="w-10 h-10 object-cover rounded-full"
      />
      <div className="flex flex-1 flex-col">
        <div className="text-sm font-semibold">
          {order.type === 'DIRECT_SALE' ? 'DS ID' : 'Order'}: {order.bulkOrderId}
        </div>
        <div className="text-sm text-muted-foreground">
          {!endTime
            ? formatFullDate(order.scheduleStartDate)
            : `${moment(order.scheduleStartDate).format('hh:mm A')} - ${moment(order.scheduleStartDate).add(order.duration, 'hour').format('hh:mm A')}`}
        </div>
      </div>
      {onClick && <ChevronRight />}
    </div>
  );
}
