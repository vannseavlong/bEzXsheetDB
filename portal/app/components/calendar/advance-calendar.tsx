import { Button } from '../ui/button';
import type { Dispatch, SetStateAction } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import DayView from './day-view';
import WeekView from './week-view';
import MonthView from './month-view';
import { useState } from 'react';

export type ViewType = 'day' | 'week' | 'month';

export default function AdvanceCalendar({
  date,
  dateRange,
  viewType,
  setViewType,
  handleEventClick,
  handleSelectCalendar,
  handleTodayClick,
  onBlockTime,
  onBlockItemClick
}: {
  date: Date;
  dateRange: { from: Date; to: Date };
  viewType: ViewType;
  setViewType: Dispatch<SetStateAction<ViewType>>;
  handleEventClick: (date?: Date) => void;
  handleSelectCalendar: (newDate: Date) => void;
  handleTodayClick: () => void;
  onBlockTime?: (date: Date) => void;
  onBlockItemClick?: (blockItem: OrderListAttributes) => void;
}) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrevious();
    }
  };

  const handlePrevious = () => {
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

  const handleNext = () => {
    const newDate = new Date(date);
    if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    handleSelectCalendar(newDate);
  };

  const getMonthYear = () => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="w-full h-full flex flex-col">
      <header className="hidden lg:block border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h1 className="font-bold text-foreground">{getMonthYear()}</h1>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTodayClick}
                  className="px-3 h-8 bg-transparent"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  className="h-8 w-8 p-0 bg-transparent"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                {(['day', 'week', 'month'] as const).map((view) => (
                  <Button
                    key={view}
                    variant={viewType === view ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewType(view)}
                    className="capitalize h-8"
                  >
                    {view}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div
        className="max-w-7xl mx-auto w-full overflow-x-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {viewType === 'day' && (
          <DayView
            currentDate={dateRange.from}
            onAddEvent={handleEventClick}
            onBlockTime={onBlockTime}
            onBlockItemClick={onBlockItemClick}
          />
        )}
        {viewType === 'week' && (
          <WeekView
            currentDate={dateRange.from}
            onAddEvent={handleEventClick}
            onBlockTime={onBlockTime}
            onBlockItemClick={onBlockItemClick}
          />
        )}
        {viewType === 'month' && (
          <MonthView currentDate={dateRange.from} onAddEvent={handleEventClick} />
        )}
      </div>
    </div>
  );
}
