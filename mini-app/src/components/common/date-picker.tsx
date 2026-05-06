import { Calendar, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Calendar as CalendarComponent } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { format } from 'date-fns';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import clsx from 'clsx';
import { Label } from '../ui/label';
import { useTranslation } from 'node_modules/react-i18next';

export type DatePickerProps = {
  date?: Date;
  onDateTimeChange?: (date: Date | undefined) => void;
  enabledTimePicker?: boolean;
  className?: string;
  iconPosition?: 'left' | 'right';
};

export default function DatePicker({
  date,
  onDateTimeChange,
  enabledTimePicker,
  className,
  iconPosition = 'left'
}: DatePickerProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Generate hours (0-23) and minutes (0-59)
  const hours = Array.from({ length: 24 }, (_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, '0')
  }));

  const minutes = Array.from({ length: 60 }, (_, i) => ({
    value: i.toString(),
    label: i.toString().padStart(2, '0')
  }));

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (date) {
      const newDate = new Date(date);
      if (type === 'hour') {
        newDate.setHours(Number.parseInt(value));
      } else {
        newDate.setMinutes(Number.parseInt(value));
      }
      onDateTimeChange?.(newDate);
    } else {
      // If no date is selected, create a new date with today's date
      const newDate = new Date();
      if (type === 'hour') {
        newDate.setHours(Number.parseInt(value));
      } else {
        newDate.setMinutes(Number.parseInt(value));
      }
      newDate.setSeconds(0);
      onDateTimeChange?.(newDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      if (date) {
        // Preserve existing time
        newDate.setHours(date.getHours());
        newDate.setMinutes(date.getMinutes());
        newDate.setSeconds(date.getSeconds());
      } else {
        // Set default time to current time
        const now = new Date();
        newDate.setHours(now.getHours());
        newDate.setMinutes(now.getMinutes());
        newDate.setSeconds(0);
      }
      onDateTimeChange?.(newDate);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={clsx('gap-2 bg-transparent justify-between h-10', className)}>
          {iconPosition === 'left' && <Calendar className="h-4 w-4" />}
          {date ? `${format(date, 'dd MMM, yyyy, hh:mm a')}` : t('dateTime.selectDate')}
          {iconPosition === 'right' && <Calendar className="h-4 w-4" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(date) => {
              if (date) {
                handleDateSelect(date);
                if (!enabledTimePicker) setOpen(false);
              }
            }}
            className="rounded-md border"
          />
        </div>
        {enabledTimePicker && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <Label className="text-sm font-medium">{t('dateTime.time')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{t('dateTime.hour')}</Label>
                <Select
                  value={date ? date.getHours().toString() : ''}
                  onValueChange={(value) => handleTimeChange('hour', value)}>
                  <SelectTrigger id="hour" className="w-full">
                    <SelectValue placeholder={t('dateTime.hh')} />
                  </SelectTrigger>
                  <SelectContent>
                    {hours.map((hour) => (
                      <SelectItem key={hour.value} value={hour.value}>
                        {hour.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-center pt-5">
                <span className="text-lg font-medium">:</span>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">{t('dateTime.minute')}</Label>
                <Select
                  value={date ? date.getMinutes().toString() : ''}
                  onValueChange={(value) => handleTimeChange('minute', value)}>
                  <SelectTrigger id="minute" className="w-full">
                    <SelectValue placeholder={t('dateTime.mm')} />
                  </SelectTrigger>
                  <SelectContent>
                    {minutes.map((minute) => (
                      <SelectItem key={minute.value} value={minute.value}>
                        {minute.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
                onClick={() => {
                  const now = new Date();
                  now.setSeconds(0);
                  onDateTimeChange?.(now);
                }}>
                {t('dateTime.now')}
              </Button>
              <Button size="sm" className="flex-1" onClick={() => setOpen(false)}>
                {t('dateTime.done')}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
