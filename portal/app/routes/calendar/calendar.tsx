import AdvanceCalendar, { type ViewType } from '@/components/calendar/advance-calendar';
import CalendarHeaderLeft from '@/components/calendar/calendar-header-left';
import CalendarOrderItem from '@/components/calendar/calendar-order-item';
import OrderListDrawer from '@/components/calendar/order-list-drawer';
import OrderListDialog from '@/components/calendar/order-list-dialog';
import CalendarHeader from '@/components/calendar/calendar-header';
import UpcomingOrderDrawer from '@/components/calendar/upcoming-order-drawer';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import useCalendarOrderQuery from '@/hooks/query/use-calendar-order-query';
import { useCalendarStore } from '@/store/calendar-store';
import { useEffect, useState } from 'react';
import { startOfWeek, endOfWeek, isEqual, startOfMonth, endOfMonth } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { ACTIONS, MODULES } from '@/lib/permission';
import { useNavigate } from 'react-router';
import { useIsMobile } from '@/hooks/use-mobile';
import useAuthStore from '@/store/auth-store';

export const handle = {
  module: MODULES.ORDER,
  action: ACTIONS.VIEW
};

import BlockTimeDialog from '@/components/calendar/block-time-dialog';
import useBlockTimeQuery from '@/hooks/query/use-block-time-query';

export default function Calendar() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBlockTimeOpen, setIsBlockTimeOpen] = useState(false);
  const [blockTimeDate, setBlockTimeDate] = useState<Date | undefined>(undefined);
  const [selectedBlockItem, setSelectedBlockItem] = useState<OrderListAttributes | undefined>(
    undefined
  );
  const [viewType, setViewType] = useState<ViewType>('week');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date()
  });
  const [date, setDate] = useState<Date>(new Date());
  const { setOrders, setBlockedTimes } = useCalendarStore();

  const defaultType =
    user?.type == 'SALES' || user?.type == 'SALES_OUTDOOR' ? 'DIRECT_SALE' : 'all';
  const { data: blockTimes } = useBlockTimeQuery({
    dateRange: { from: dateRange.from, to: dateRange.to }
  });

  useEffect(() => {
    if (blockTimes) {
      const formattedBlockedTimes = blockTimes.map((item) => {
        const scheduleStartDate = new Date(item.blockedDate);
        const [startHour, startMinute] = item.startTime.split(':').map(Number);
        scheduleStartDate.setHours(startHour, startMinute, 0, 0);

        const [endHour, endMinute] = item.endTime.split(':').map(Number);
        const endDate = new Date(item.blockedDate);
        endDate.setHours(endHour, endMinute, 0, 0);

        if (endDate < scheduleStartDate) {
          endDate.setDate(endDate.getDate() + 1);
        }

        const durationInMillis = endDate.getTime() - scheduleStartDate.getTime();
        const durationInHours = durationInMillis / (1000 * 60 * 60);

        return {
          bulkOrderId: item.bulkOrderId, // Use ID from backend
          type: 'BLOCKED' as const,
          scheduleStartDate: scheduleStartDate.toISOString(),
          duration: durationInHours,
          note: item.name,
          address: item.associatedAddress?.id,
          cleaners: item.cleanerDetails?.map((d) => d.cleaner) || []
        } as unknown as OrderListAttributes;
      });

      console.log({ formattedBlockedTimes });
      setBlockedTimes(formattedBlockedTimes);
    }
  }, [blockTimes, setBlockedTimes]);
  const { data: ordersData, isPending } = useCalendarOrderQuery({
    statusFilter: ['ACCEPTED', 'COMPLETED'],
    dateRange: { from: dateRange.from, to: dateRange.to },
    searchText: '',
    paymentStatusFilter: '',
    type: defaultType
  });

  const orders: OrderListAttributes[] = ordersData?.data || [];

  const handleSelect = (dates: DateRange) => {
    // console.log('handleSelect dates: ', dates);
    let newDate;
    if (dates.from && dates.to) {
      if (!isEqual(dateRange.from, dates.from)) {
        newDate = dates.from;
      }
      if (!isEqual(dateRange.to, dates.to)) {
        newDate = dates.to;
      }
    }

    if (newDate) {
      handleSelectCalendar(newDate);
    }
  };

  const handleSelectCalendar = (newDate: Date) => {
    switch (viewType) {
      case 'day':
        if (newDate) setDateRange({ from: newDate, to: newDate });
        break;

      case 'week':
        if (newDate) setDateRange({ from: startOfWeek(newDate), to: endOfWeek(newDate) });
        break;

      case 'month':
        if (newDate) setDateRange({ from: startOfMonth(newDate), to: endOfMonth(newDate) });
        break;

      default:
        break;
    }
  };

  const handleBlockTime = (date: Date) => {
    setBlockTimeDate(date);
    setSelectedBlockItem(undefined);
    setIsBlockTimeOpen(true);
  };

  const handleBlockItemClick = (blockItem: OrderListAttributes) => {
    setSelectedBlockItem(blockItem);
    setBlockTimeDate(undefined);
    setIsBlockTimeOpen(true);
  };

  useEffect(() => {
    handleSelectCalendar(dateRange.from);
  }, [viewType]);

  useEffect(() => {
    if (ordersData) {
      // console.log('useEffect orders: ', orders);
      setOrders(ordersData.data);
    }
  }, [ordersData, setOrders]);

  const handlePrevDate = () => {
    const newDate = new Date(dateRange.from);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    handleSelectCalendar(newDate);
  };

  const handleNextDate = () => {
    const newDate = new Date(dateRange.from);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    handleSelectCalendar(newDate);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Mobile/Tablet Header */}
      <div className="lg:hidden">
        <CalendarHeader
          dateRange={dateRange}
          viewType={viewType}
          setViewType={setViewType}
          onPrevDate={handlePrevDate}
          onNextDate={handleNextDate}
          onTodayClick={() => {
            const newDate = new Date();
            handleSelectCalendar(newDate);
          }}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          onBackClick={() => navigate(-1)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-w-0">
        {/* Desktop Sidebar - Hidden on mobile/tablet */}
        <div className="hidden lg:flex w-70 border-r flex-col h-full shrink-0">
          <div className="flex flex-col">
            <CalendarHeaderLeft />
            <CalendarComponent
              mode="range"
              required
              selected={dateRange}
              onSelect={handleSelect}
              // disabled={viewType === 'month'}
              // onMonthChange={handleMonthChange}
            />
            <div className="px-4 border-t pt-4 font-bold">Upcoming Order</div>
          </div>
          <div className="flex-1 overflow-auto px-4 pt-4 flex flex-col gap-4">
            {isPending ? (
              <div>loading..</div>
            ) : (
              orders.map((order, index) => <CalendarOrderItem key={index} order={order} />)
            )}
          </div>
        </div>

        <div className="flex h-full w-full flex-col items-start min-w-0">
          <div className="flex-1 w-full flex flex-col items-center overflow-auto min-w-0">
            <AdvanceCalendar
              {...{
                date: dateRange.from,
                setDate,
                dateRange,
                viewType,
                setViewType,
                handleEventClick: (date) => {
                  if (date) {
                    setDate(date);
                    setIsOpen(true);
                  }
                },
                handleSelectCalendar,
                handleTodayClick: () => {
                  const newDate = new Date();
                  handleSelectCalendar(newDate);
                },
                onBlockTime: handleBlockTime,
                onBlockItemClick: handleBlockItemClick
              }}
            />
            {/* Desktop/Tablet: Use drawer on the right side */}
            {!isMobile && <OrderListDrawer {...{ orders, date, isOpen, setIsOpen }} />}
            {/* Mobile: Use full-screen dialog */}
            {isMobile && <OrderListDialog {...{ orders, date, isOpen, setIsOpen }} />}

            <BlockTimeDialog
              isOpen={isBlockTimeOpen}
              onOpenChange={setIsBlockTimeOpen}
              initialDate={blockTimeDate}
              initialData={selectedBlockItem}
            />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Upcoming Order Drawer */}
      <UpcomingOrderDrawer
        isOpen={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        orders={orders}
        isPending={isPending}
      />
    </div>
  );
}
