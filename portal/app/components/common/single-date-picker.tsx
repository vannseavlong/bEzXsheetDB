import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTranslation } from 'react-i18next';
import { format, parse } from 'date-fns';
import clsx from 'clsx';
import { type Control } from 'react-hook-form';
import { Calendar04Icon } from 'hugeicons-react';

interface ValidFromDatePickerProps {
  control: Control;
  name: string;
  label?: string; // optional label override
  placeholder?: string; // optional placeholder override
  disabled?: boolean; // optional disabled flag
}

export function ValidFromDatePicker({
  control,
  name,
  label = 'Valid From', // default label
  placeholder = 'Select date', // default placeholder
  disabled = false
}: ValidFromDatePickerProps) {
  const { t } = useTranslation();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{t(label)}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={clsx(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(parse(field.value, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')
                  ) : (
                    <span>{t(placeholder)}</span>
                  )}

                  <Calendar04Icon
                    size={28}
                    color="black"
                    strokeWidth={1.5}
                    className="ml-auto h-4 w-4 "
                  />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? parse(field.value, 'yyyy-MM-dd', new Date()) : undefined}
                onSelect={(date) => {
                  field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                }}
                disabled={(date) => date < new Date('1900-01-01')}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
