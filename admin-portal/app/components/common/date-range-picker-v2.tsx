import { Calendar } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';

export type DateRangePickerProps = {
  dateRange: { from?: Date; to?: Date };
  setDateRange: (range: { from?: Date; to?: Date }) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  iconHidden?: boolean;
  className?: string;
  initialDateRange?: { from?: Date; to?: Date };
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
};

export default function DateRangePickerV2({
  dateRange,
  setDateRange,
  isCalendarOpen,
  setIsCalendarOpen,
  iconHidden,
  className,
  initialDateRange,
  align = 'end',
  side
}: DateRangePickerProps) {
  const isMobile = useIsMobile();
  const [dateRangeType, setDateRangeType] = useState('Custom');
  const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({
    ...dateRange
  });

  const handleReset = () => {
    setDateRangeType('Custom');
    setSelectedRange(
      initialDateRange || {
        from: undefined,
        to: undefined
      }
    );
  };

  const handleApply = () => {
    setDateRange({ ...selectedRange });
    setIsCalendarOpen(false);
  };

  useEffect(() => {
    switch (dateRangeType) {
      case 'Today': {
        const today = new Date();
        setSelectedRange({
          from: today,
          to: today
        });
        break;
      }
      case 'Yesterday': {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        setSelectedRange({
          from: yesterday,
          to: yesterday
        });
        break;
      }
      case '7Days': {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        setSelectedRange({
          from: sevenDaysAgo,
          to: new Date()
        });
        break;
      }
      case 'This Month': {
        const today = new Date();
        setSelectedRange({
          from: startOfMonth(today),
          to: endOfMonth(today)
        });
        break;
      }
      case 'Last Month': {
        const today = new Date();
        const lastMonth = subMonths(today, 1);
        setSelectedRange({
          from: startOfMonth(lastMonth),
          to: endOfMonth(lastMonth)
        });
        break;
      }
    }
  }, [dateRangeType]);

  const TriggerButton = (
    <Button
      size="sm"
      variant="outline"
      className={clsx('gap-2 bg-transparent min-w-[140px] justify-start ', className)}
    >
      <Calendar className={clsx('h-4 w-4', { hidden: iconHidden })} />
      {dateRange.from && dateRange.to
        ? `${format(dateRange.from, 'dd MMM, yyyy')} - ${format(dateRange.to, 'dd MMM, yyyy')}`
        : 'Select date range'}
    </Button>
  );

  const Content = (
    <div className="flex flex-col md:flex-row p-0 md:p-4 mt-6 md:mt-0">
      <RadioGroup
        value={dateRangeType}
        onValueChange={setDateRangeType}
        className="flex flex-row flex-wrap md:flex-col gap-4 p-4 md:pr-6 "
      >
        <RadioGroupItemComponent value="Today" id="1" />
        <RadioGroupItemComponent value="Yesterday" id="2" />
        <RadioGroupItemComponent value="7Days" id="3" />
        <RadioGroupItemComponent value="This Month" id="4" />
        <RadioGroupItemComponent value="Last Month" id="5" />
        <RadioGroupItemComponent value="Custom" id="6" />
      </RadioGroup>
      <div>
        <div className="text-center text-xs md:text-sm">
          {selectedRange.from ? `${format(selectedRange.from, 'dd MMM, yyyy')}` : '-'} to{' '}
          {selectedRange.to ? `${format(selectedRange.to, 'dd MMM, yyyy')}` : '-'}
        </div>
        <div className="flex flex-col md:flex-row gap-4 p-4 items-center">
          <div className="space-y-1">
            <div className="text-xs md:text-sm font-bold">From</div>
            <CalendarComponent
              mode="single"
              selected={selectedRange.from}
              onSelect={(date) => {
                if (date) {
                  const d = new Date(date);
                  d.setHours(0, 0, 0, 0);
                  setSelectedRange((prev) => ({
                    ...prev,
                    from: d,
                    // If "to" is before the new "from", reset it
                    to: prev.to && date && prev.to < date ? undefined : prev.to
                  }));
                }
              }}
              numberOfMonths={1}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-1">
            <div className="text-xs md:text-sm font-bold">To</div>
            <CalendarComponent
              mode="single"
              selected={selectedRange.to}
              onSelect={(date) => {
                if (date) {
                  const d = new Date(date);
                  d.setHours(23, 59, 59, 999);
                  setSelectedRange((prev) => ({
                    ...prev,
                    to: d
                  }));
                }
                // setSelectedRange((prev) => ({
                //   ...prev,
                //   to: date
                // }));
              }}
              numberOfMonths={1}
              className="rounded-md border"
              disabled={selectedRange.from ? { before: selectedRange.from } : undefined}
              fromDate={selectedRange.from} // also prevents earlier selection
            />
          </div>
        </div>
        {/* to be fixed in very bottom sticky */}
        <div className="p-4 pt-0 flex items-end justify-end gap-4 sticky bottom-0 left-0 right-0 bg-white">
          <Button onClick={handleReset} size="sm" variant="outline">
            Reset
          </Button>
          <Button onClick={handleApply} size="sm">
            Apply
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="w-[90vw] max-h-[90vh] overflow-y-auto p-0 md:max-w-[800px]">
          {Content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
      <PopoverContent className="w-auto p-0 overflow-scroll" align={align} side={side}>
        {Content}
      </PopoverContent>
    </Popover>
  );
}

const RadioGroupItemComponent = ({ value, id }: { value: string; id: string }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <RadioGroupItem value={value} id={id} />
      <Label className="text-xs md:text-sm" htmlFor={id}>
        {value}
      </Label>
    </div>
  );
};
