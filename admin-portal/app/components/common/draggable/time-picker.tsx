import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Clock } from 'lucide-react';
type Props = {
  serviceTime?: boolean;
  time?: string;
  onChange?: (time: string) => void;
  disabled?: (time: string) => boolean;
};
export default function TimePicker({ serviceTime = true, time, onChange, disabled }: Props) {
  let timeOptions = [
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00'
  ];
  if (!serviceTime) {
    timeOptions = [
      '00:00',
      '00:30',
      '01:00',
      '01:30',
      '02:00',
      '02:30',
      '03:00',
      '03:30',
      '04:00',
      '04:30',
      '05:00',
      '05:30',
      '06:00',
      '06:30',
      '07:00',
      '07:30',
      '08:00',
      '08:30',
      '09:00',
      '09:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
      '13:00',
      '13:30',
      '14:00',
      '14:30',
      '15:00',
      '15:30',
      '16:00',
      '16:30',
      '17:00',
      '17:30',
      '18:00',
      '18:30',
      '19:00',
      '19:30',
      '20:00',
      '20:30',
      '21:00',
      '21:30',
      '22:00',
      '22:30',
      '23:00',
      '23:30'
    ];
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={time} onValueChange={onChange}>
        <SelectTrigger className="w-full h-11! [&>*:last-child]:hidden">
          <SelectValue />

          <Clock className="mr-2 h-4 w-4" />
        </SelectTrigger>
        <SelectContent>
          {timeOptions.map((timeOption) => (
            <SelectItem
              key={timeOption}
              value={timeOption}
              disabled={disabled ? disabled(timeOption) : false}
            >
              {timeOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
