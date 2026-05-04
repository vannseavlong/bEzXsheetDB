import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/store/calendar-store';
import OrderBlock from './order-block';
import { useIsMobile } from '@/hooks/use-mobile';

interface DayViewProps {
  currentDate: Date;
  onAddEvent: (date: Date) => void;
  onBlockTime?: (date: Date) => void;
  onBlockItemClick?: (blockItem: OrderListAttributes) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 6); // 6 to 18

// Function to get orders that start in a specific hour
function getOrdersStartingInHour(orders: OrderListAttributes[], hour: number) {
  return orders.filter((order) => {
    const eventDate = new Date(order.scheduleStartDate);
    const eventHour = eventDate.getHours();
    return eventHour === hour;
  });
}

// Function to remove duplicates by bulkOrderId
function removeDuplicates(orders: OrderListAttributes[]) {
  const uniqueOrdersMap = new Map();
  for (const order of orders) {
    if (!uniqueOrdersMap.has(order.bulkOrderId)) {
      uniqueOrdersMap.set(order.bulkOrderId, order);
    }
  }
  return Array.from(uniqueOrdersMap.values());
}

import { Plus } from 'lucide-react';

export default function DayView({
  currentDate,
  onAddEvent,
  onBlockTime,
  onBlockItemClick
}: DayViewProps) {
  const { orders } = useCalendarStore();
  const isMobile = useIsMobile();

  // Mobile: max 4 orders (show 3 + remaining), Web: max 6 orders (show 5 + remaining)
  // const MAX_ORDERS = isMobile ? 4 : 6;
  const VISIBLE_ORDERS = isMobile ? 3 : 5;

  const dayOrders = orders.filter((order) => {
    const eventDate = new Date(order.scheduleStartDate);
    return (
      eventDate.getDate() === currentDate.getDate() &&
      eventDate.getMonth() === currentDate.getMonth() &&
      eventDate.getFullYear() === currentDate.getFullYear()
    );
  });

  return (
    <div className="p-2 sm:p-4 lg:p-6 [--calendar-row-height:60px] sm:[--calendar-row-height:70px] lg:[--calendar-row-height:80px]">
      <div className="mb-4 sm:mb-6 flex items-center justify-center">
        <h2 className="text-sm sm:text-base">{format(currentDate, 'EEE d')}</h2>
      </div>

      <div className="grid grid-cols-[50px_1fr] sm:grid-cols-[60px_1fr] lg:grid-cols-[100px_1fr] gap-0 border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 border-r border-border">
          {HOURS.map((hour) => (
            <div
              key={`${hour}-col`}
              className="h-[var(--calendar-row-height)] p-1 sm:p-2 lg:p-3 text-[9px] sm:text-xs lg:text-sm text-muted-foreground border-b border-border flex items-start justify-end"
            >
              {format(new Date(2024, 0, 1, hour), 'ha')}
            </div>
          ))}
        </div>

        <div className="relative">
          {(() => {
            const displayedOrders = new Set<string>(); // track orders already displayed

            return HOURS.map((hour) => {
              // Get orders that START in this hour
              const hourStartOrders = getOrdersStartingInHour(dayOrders, hour);
              const uniqueOrders = removeDuplicates(hourStartOrders);

              // Filter out orders already displayed
              const newOrders = uniqueOrders.filter(
                (order) => !displayedOrders.has(order.bulkOrderId)
              );

              // Mark these orders as displayed
              newOrders.forEach((order) => displayedOrders.add(order.bulkOrderId));

              // Limit to visible orders and calculate remaining
              const visibleOrders = newOrders.slice(0, VISIBLE_ORDERS);
              const remainingCount =
                newOrders.length > VISIBLE_ORDERS ? newOrders.length - VISIBLE_ORDERS : 0;

              return (
                <div
                  key={`${hour}-row`}
                  className={cn(
                    'group border-b border-border hover:bg-muted/50 cursor-pointer transition-colors relative h-[var(--calendar-row-height)]',
                    visibleOrders.length > 0 && 'z-20'
                  )}
                  onClick={() => {
                    const eventDate = new Date(currentDate);
                    eventDate.setHours(hour, 0, 0, 0);
                    onAddEvent(eventDate);
                  }}
                >
                  <div className="absolute inset-0 flex gap-1 p-1">
                    {visibleOrders.map((order) => (
                      <div
                        key={order.bulkOrderId}
                        className="flex-1 min-w-0"
                        onClick={(e) => {
                          if (order.type === 'BLOCKED') {
                            e.stopPropagation();
                            onBlockItemClick?.(order);
                          }
                        }}
                      >
                        <OrderBlock order={order} viewType={'day'} />
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="flex-1 min-w-15 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded bg-muted/30">
                        +{remainingCount}
                      </div>
                    )}

                    {/* Add Block Time Trigger */}
                    {!visibleOrders.some((o) => o.type === 'BLOCKED') && (
                      <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const eventDate = new Date(currentDate);
                            eventDate.setHours(hour, 0, 0, 0);
                            onBlockTime?.(eventDate);
                          }}
                          className="bg-primary text-white rounded-full p-1 shadow-sm hover:bg-primary/90"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}
