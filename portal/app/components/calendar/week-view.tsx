import { format, startOfWeek, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/store/calendar-store';
import OrderBlock from './order-block';

interface WeekViewProps {
  currentDate: Date;
  onAddEvent: (date: Date) => void;
  onBlockTime?: (date: Date) => void;
  onBlockItemClick?: (blockItem: OrderListAttributes) => void;
}

const HOURS = Array.from({ length: 13 }, (_, i) => i + 6); // 6 to 18

function getLayout(orders: OrderListAttributes[], hourStart: number, hourEnd: number) {
  const hourOrders = orders.filter((order) => {
    const eventDate = new Date(order.scheduleStartDate);
    const eventHour = eventDate.getHours();
    const eventMinute = eventDate.getMinutes();
    const eventDuration = order.duration || 60;

    const eventStartInMinutes = eventHour * 60 + eventMinute;
    const eventEndInMinutes = eventStartInMinutes + eventDuration;
    const hourStartInMinutes = hourStart * 60;
    const hourEndInMinutes = hourEnd * 60;

    return eventStartInMinutes < hourEndInMinutes && eventEndInMinutes > hourStartInMinutes;
  });

  // Remove duplicates (unique by bulkOrderId)
  const uniqueOrdersMap = new Map();
  for (const order of hourOrders) {
    if (!uniqueOrdersMap.has(order.bulkOrderId)) {
      uniqueOrdersMap.set(order.bulkOrderId, order);
    }
  }
  const uniqueOrders = Array.from(uniqueOrdersMap.values());

  return uniqueOrders;
}

import { Plus } from 'lucide-react';

export default function WeekView({
  currentDate,
  onAddEvent,
  onBlockTime,
  onBlockItemClick
}: WeekViewProps) {
  const { orders, blockedTimes } = useCalendarStore();
  const allOrders = [...orders, ...(blockedTimes || [])];

  // Get the start of the week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter orders for each day of the week
  const getOrdersForDay = (date: Date) => {
    return allOrders.filter((order) => {
      const eventDate = new Date(order.scheduleStartDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6 [--calendar-row-height:60px] sm:[--calendar-row-height:70px] lg:[--calendar-row-height:80px]">
      {/* <div className="mb-6 flex items-center justify-center">
        <h2 className="text-lg font-semibold">
          {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
        </h2>
      </div> */}

      <div className="grid grid-cols-[50px_repeat(7,1fr)] sm:grid-cols-[60px_repeat(7,1fr)] lg:grid-cols-[100px_repeat(7,1fr)] gap-0 border border-border rounded-lg overflow-hidden">
        {/* Time column header */}
        <div className="bg-muted/30 border-r border-b border-border p-1 sm:p-2 lg:p-3"></div>

        {/* Day headers */}
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className="bg-muted/30 border-r last:border-r-0 border-b border-border p-1 sm:p-2 lg:p-3 text-center"
          >
            <div className="font-semibold text-[10px] sm:text-xs lg:text-sm">
              {format(day, 'EEE')}
            </div>
            <div className="text-[9px] sm:text-xs lg:text-sm text-muted-foreground">
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Time labels */}
        <div className="bg-muted/30 border-r border-border">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="h-[var(--calendar-row-height)] p-1 sm:p-2 lg:p-3 text-[9px] sm:text-xs lg:text-sm text-muted-foreground border-b border-border flex items-start justify-end"
            >
              {format(new Date(2024, 0, 1, hour), 'ha')}
            </div>
          ))}
        </div>

        {/* Week grid */}
        {weekDays.map((day) => {
          const dayOrders = getOrdersForDay(day);
          const seen = new Set<string>(); // track shown orders for the day

          return (
            <div key={day.toString()} className="relative border-r last:border-r-0 border-border">
              {HOURS.map((hour) => {
                const hourOrders = getLayout(dayOrders, hour, hour + 1);
                const filteredOrders = hourOrders.filter((order) => {
                  if (seen.has(order.bulkOrderId)) return false;
                  seen.add(order.bulkOrderId);
                  return true;
                });

                // compute height based on longest duration
                // const baseHeight = 60; // matches time column responsive heights
                // const maxRowHeight =
                //   filteredOrders.length > 0
                //     ? Math.max(...filteredOrders.map(() => (60 / 60) * baseHeight))
                //     : baseHeight;

                return (
                  <div
                    key={hour}
                    className={cn(
                      'group border-b border-border hover:bg-muted/50 cursor-pointer transition-colors relative h-[var(--calendar-row-height)]',
                      filteredOrders.length > 0 && 'z-20'
                    )}
                    onClick={() => {
                      const eventDate = new Date(day);
                      eventDate.setHours(hour, 0, 0, 0);
                      onAddEvent(eventDate);
                    }}
                  >
                    <div className="absolute inset-0 flex gap-1">
                      {filteredOrders.length > 2 ? (
                        <>
                          <div className="flex-1 min-w-0">
                            <OrderBlock order={filteredOrders[0]} viewType="week" />
                          </div>
                          <div className="flex-1 min-w-0 flex items-center justify-center">
                            <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-muted-foreground">
                              +{filteredOrders.length - 1}
                            </span>
                          </div>
                        </>
                      ) : (
                        filteredOrders.map((order) => (
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
                            <OrderBlock order={order} viewType="week" />
                          </div>
                        ))
                      )}

                      {/* Add Block Time Trigger */}
                      {!filteredOrders.some((o) => o.type === 'BLOCKED') && (
                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const eventDate = new Date(day);
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
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
