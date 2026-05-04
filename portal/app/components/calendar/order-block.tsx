import type { ViewType } from './advance-calendar';

interface EventBlockProps {
  order: OrderListAttributes;
  viewType: ViewType;
  overideText?: string;
}

export default function OrderBlock({ order, viewType, overideText }: EventBlockProps) {
  // console.log('OrderBlock: ', order);
  // const eventDate = new Date(order.scheduleStartDate);
  // const startHour = eventDate.getHours();
  // const startMinute = eventDate.getMinutes();
  // const duration = order.duration || 60;

  // const topPercent = (startMinute / 60) * 100;
  // const heightPercent = (duration / 60) * 100;

  const getEventColor = (type: string) => {
    switch (type) {
      case 'ORDER':
        return 'bg-primary/10 border-primary';
      case 'BLOCKED':
        return 'bg-deep-cleaning/10 border-deep-cleaning';
      default:
        return 'bg-destructive/10 border-destructive';
    }
  };

  return (
    <div
      key={order.bulkOrderId}
      className={`flex-1 text-sm flex items-center px-1 md:px-2 py-1 border-l-8 ${getEventColor(order.type)} z-10`}
      style={{
        height:
          viewType === 'month'
            ? '50px'
            : `calc(var(--calendar-row-height) * ${order.duration || 1})`,
        minHeight: '40px'
      }}
    >
      <span className="truncate w-full">
        {overideText ?? (
          <>
            {order.type === 'BLOCKED' ? (
              <div className="font-medium truncate">{order.note}</div>
            ) : (
              <>
                Order
                <br />#{Number(order.bulkOrderId)}
              </>
            )}
          </>
        )}
      </span>
    </div>
  );

  // return (
  //   <div
  //     className={`absolute left-1 right-1 rounded-md p-2 text-white text-xs font-medium overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getEventColor(
  //       order.type
  //     )}`}
  //     style={{
  //       top: `calc(${startHour * 60 + startMinute}px + ${topPercent}%)`,
  //       width: `${100 / columns}%`,
  //       height: `calc(${heightPercent}% + ${duration}px)`,
  //       minHeight: '30px'
  //     }}
  //   >
  //     {/* <div
  //     className={`rounded-md p-2 text-white font-medium overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer ${getEventColor(
  //       order.type
  //     )}`}> */}
  //     <div className="font-semibold truncate">Order #{order.bulkOrderId}</div>
  //     {/* {order.candidate && <div className="text-xs opacity-90 truncate">{order.candidate}</div>}
  //     <div className="text-xs opacity-90">
  //       {format(eventDate, 'h:mm a')} ({duration}m)
  //     </div> */}
  //   </div>
  // );
}
