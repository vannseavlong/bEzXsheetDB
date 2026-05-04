import { format } from 'date-fns';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewType } from './advance-calendar';

interface CalendarHeaderProps {
  dateRange: { from: Date; to: Date };
  viewType: ViewType;
  setViewType: (viewType: ViewType) => void;
  onPrevDate: () => void;
  onNextDate: () => void;
  onTodayClick: () => void;
  onMenuClick: () => void;
  onBackClick: () => void;
}

export default function CalendarHeader({
  dateRange,
  viewType,
  setViewType,
  onMenuClick,
  onBackClick
}: CalendarHeaderProps) {
  const getDateDisplay = () => {
    if (viewType === 'day') {
      return format(dateRange.from, 'MMMM d, yyyy');
    } else if (viewType === 'week') {
      return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`;
    } else {
      return format(dateRange.from, 'MMMM yyyy');
    }
  };

  return (
    <div className="border-b p-2 sm:p-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onBackClick}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="text-xs sm:text-sm font-medium truncate px-1">{getDateDisplay()}</div>
      </div>

      <div className="flex items-center gap-0.5 shrink-0">
        <Button
          variant={viewType === 'day' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[10px] sm:text-xs"
          onClick={() => setViewType('day')}
        >
          Day
        </Button>
        <Button
          variant={viewType === 'week' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[10px] sm:text-xs"
          onClick={() => setViewType('week')}
        >
          Week
        </Button>
        <Button
          variant={viewType === 'month' ? 'default' : 'ghost'}
          size="sm"
          className="h-7 px-2 text-[10px] sm:text-xs"
          onClick={() => setViewType('month')}
        >
          Month
        </Button>

        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onMenuClick}>
          <MoreVertical className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
