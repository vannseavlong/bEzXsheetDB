import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import TimePicker from './draggable/time-picker';
import { useState } from 'react';
import moment from 'moment';
import { formatDate } from '@/lib/date-helper';
import { Label } from '../ui/label';
import { Calendar03Icon } from 'hugeicons-react';

type Props = {
  date?: string | Date;
  onChange: (newDate: Date) => void;
  label?: string | React.ReactNode; // optional label override
  haveIcon?: boolean;
  serviceTime?: boolean;
  title?: string;
  buttonText?: string;
  disabled?: boolean;
  disabledPast?: boolean;
};

export function DateTimePicker({
  label,
  date,
  onChange,
  haveIcon = false,
  serviceTime = true,
  title = 'Reschedule Date',
  buttonText = 'Reschedule Now',
  disabled,
  disabledPast
}: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? moment(date).toDate() : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    date ? moment(date).format('HH:mm') : undefined
  );
  const [open, setOpen] = useState(false);

  return (
    <div className="flex relative gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex flex-col gap-2 w-full">
          {label && <Label className="text-muted-foreground">{label}</Label>}
          <PopoverTrigger asChild>
            <Button className="flex justify-between h-10" variant="outline" disabled={disabled}>
              {date ? formatDate(date, true) : 'Select date'}
              {haveIcon && <Calendar03Icon />}
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent className="w-auto p-4">
          <div className="text-center font-bold">{title}</div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              // build date + time
              if (disabledPast && date) {
                const now = new Date();
                const dateTime = new Date(date);
                if (selectedTime) {
                  const [hours, minutes] = selectedTime.split(':').map(Number);
                  dateTime.setHours(hours, minutes, 0, 0);
                }
                // reset time if selected time is in the pasts
                if (dateTime < now) {
                  setSelectedTime('');
                }
              }

              setSelectedDate(date);
            }}
            disabled={(date) => {
              if (!disabledPast) return date < new Date('1900-01-01');

              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
          />
          <TimePicker
            serviceTime={serviceTime}
            time={selectedTime}
            onChange={setSelectedTime}
            disabled={(time) => {
              if (!disabledPast || !selectedDate) return false;
              const [hours, minutes] = time.split(':').map(Number);

              const now = new Date();

              // build date + time
              const selectedDateTime = new Date(selectedDate);
              selectedDateTime.setHours(hours, minutes, 0, 0);

              // check if selected date is today
              const isToday =
                selectedDate.getFullYear() === now.getFullYear() &&
                selectedDate.getMonth() === now.getMonth() &&
                selectedDate.getDate() === now.getDate();

              // only disable past time if today
              if (isToday) {
                return selectedDateTime < now;
              }

              return false;
            }}
          />
          <Button
            size="sm"
            className="w-full mt-6"
            onClick={() => {
              if (selectedDate && selectedTime) {
                const newDate = new Date(selectedDate);
                const [hour, minute] = selectedTime.split(':');
                newDate.setHours(Number.parseInt(hour));
                newDate.setMinutes(Number.parseInt(minute));
                onChange(newDate);
                setOpen(false);
              }
            }}
          >
            {buttonText}
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}
