import { useMemo } from 'react';
import { useTranslation } from 'node_modules/react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DayItem {
  day: string;
  date: number;
  month: number;
  year: number;
  monthName: string;
  fullDate: Date;
}

interface DateSelectorProps {
  confirmedDate: Date | null;
  isTimeSelected: boolean;
  onDateSelect: (date: Date) => void;
  isClosedDate?: (date: Date) => boolean;
  className?: string;
}

export function useDateSelector() {
  const { t } = useTranslation();

  const dayNames = [
    t('common.days.sun'),
    t('common.days.mon'),
    t('common.days.tue'),
    t('common.days.wed'),
    t('common.days.thu'),
    t('common.days.fri'),
    t('common.days.sat')
  ];

  const nextDays = useMemo((): DayItem[] => {
    const days: DayItem[] = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);

      days.push({
        day: dayNames[nextDate.getDay()],
        date: nextDate.getDate(),
        month: nextDate.getMonth(),
        year: nextDate.getFullYear(),
        monthName: '',
        fullDate: nextDate
      });
    }

    return days;
  }, [dayNames]);

  return { nextDays };
}

export function DateSelector({
  confirmedDate,
  isTimeSelected,
  onDateSelect,
  isClosedDate,
  className
}: DateSelectorProps) {
  const { t } = useTranslation();
  const { nextDays } = useDateSelector();

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isClosed = (date: Date) => isClosedDate?.(date) ?? false;

  return (
    <div className={cn('flex gap-4 overflow-x-auto no-scrollbar', className)}>
      {nextDays.map((item) => (
        <div key={`${item.date}-${item.month}-${item.year}`} className="flex flex-col items-center">
          <Button
            type="button"
            variant="outline"
            disabled={isClosed(item.fullDate)}
            onClick={() => onDateSelect(item.fullDate)}
            className={cn(
              'relative px-4 py-8 rounded-lg text-center transition-colors flex flex-col items-center justify-center flex-shrink-0 w-[54px] h-[68px]',
              isClosed(item.fullDate)
                ? 'border border-red-500 cursor-not-allowed opacity-100'
                : confirmedDate && isSameDay(confirmedDate, item.fullDate) && isTimeSelected
                  ? 'bg-primary-gradient text-white border-primary-gradient'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-200'
            )}>
            <span className="text-sm font-semibold whitespace-nowrap">{item.day}</span>
            <span
              className={cn(
                'text-sm font-light',
                confirmedDate && isSameDay(confirmedDate, item.fullDate) && isTimeSelected
                  ? 'text-white'
                  : 'font-semibold'
              )}>
              {item.date}
            </span>
            {isClosed(item.fullDate) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-red-500 text-white px-4 rounded-lg">
                {t('schedule.closed')}
              </span>
            )}
          </Button>
        </div>
      ))}
    </div>
  );
}

export default DateSelector;
