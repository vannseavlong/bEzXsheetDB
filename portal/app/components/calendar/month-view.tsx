import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay
} from 'date-fns';
import { useCalendarStore } from '@/store/calendar-store';
import OrderBlock from './order-block';

import { Plus } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
  onAddEvent: (date: Date) => void;
  onBlockTime?: (date: Date) => void;
}

export default function MonthView({ currentDate, onAddEvent, onBlockTime }: MonthViewProps) {
  const { orders, blockedTimes } = useCalendarStore();
  const allOrders = [...orders, ...(blockedTimes || [])];

  // Get month boundaries
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  // Generate all days to display
  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Group days into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  // Filter orders for a specific day
  const getOrdersForDay = (date: Date) => {
    const dayOrders = allOrders.filter((order) => {
      const eventDate = new Date(order.scheduleStartDate);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });

    // Remove duplicates by bulkOrderId
    const uniqueOrdersMap = new Map();
    for (const order of dayOrders) {
      if (!uniqueOrdersMap.has(order.bulkOrderId)) {
        uniqueOrdersMap.set(order.bulkOrderId, order);
      }
    }
    return Array.from(uniqueOrdersMap.values());
  };

  return (
    <div className="p-2 sm:p-4 lg:p-6">
      {/* <div className="mb-6 flex items-center justify-center">
        <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
      </div> */}

      <div className="border border-border rounded-lg overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 bg-muted/30 border-b border-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="p-1.5 sm:p-2 lg:p-3 text-center font-semibold text-[10px] sm:text-xs lg:text-sm border-r last:border-r-0 border-border"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {weeks.map((week, weekIndex) =>
            week.map((day) => {
              const dayOrders = getOrdersForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toString()}
                  className={`group relative min-h20 sm:min-h-25 lg:min-h-30 p-1 sm:p-1.5 lg:p-2 border-r border-b last:border-r-0 ${
                    weekIndex === weeks.length - 1 ? 'border-b-0' : ''
                  } ${isCurrentMonth ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/50 cursor-pointer transition-colors`}
                  onClick={() => onAddEvent(day)}
                >
                  {/* Date number */}
                  <div className="mb-1 sm:mb-1.5 lg:mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[10px] sm:text-xs lg:text-sm rounded-full ${
                        isToday
                          ? 'bg-primary text-primary-foreground font-semibold'
                          : isCurrentMonth
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Orders */}
                  <div className="space-y-0.5 sm:space-y-1">
                    {dayOrders.slice(0, 2).map((order) => (
                      <div key={order.bulkOrderId} className="text-[10px] sm:text-xs">
                        <OrderBlock order={order} viewType="month" />
                      </div>
                    ))}
                    {dayOrders.length > 2 && (
                      <div className="text-[9px] sm:text-xs text-muted-foreground font-medium px-1 sm:px-2">
                        +{dayOrders.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Add Block Time Trigger */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Default to 8 AM or current time if today
                        const eventDate = new Date(day);
                        eventDate.setHours(8, 0, 0, 0);
                        onBlockTime?.(eventDate);
                      }}
                      className="bg-primary text-white rounded-full p-1 shadow-sm hover:bg-primary/90"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
