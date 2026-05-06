import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import DateRangePicker from './date-range-picker-v2';
import { useState } from 'react';

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  displayMessage?: boolean;
  className?: string;
  disabled?: boolean;
};

export default function FormDateRangePicker<T extends FieldValues>({
  control,
  name,
  label,
  displayMessage = true,
  className
}: Props<T>) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <FormItem>
          {label === undefined ? null : label === '' ? (
            <div className="h-3.5" />
          ) : (
            <FormLabel>{label}</FormLabel>
          )}
          <FormControl>
            <DateRangePicker
              align="start"
              side="left"
              className={className}
              setDateRange={onChange}
              dateRange={value}
              isCalendarOpen={isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
            />
          </FormControl>
          {displayMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
