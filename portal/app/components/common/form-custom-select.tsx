import clsx from 'clsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  displayMessage?: boolean;
  disabled?: boolean;
  data: { label: string; value: string; disabled?: boolean }[];
  className?: string;
  prefix?: string;
};

export default function FormCustomSelect<T extends FieldValues>({
  control,
  name,
  label,
  className,
  placeholder,
  prefix,
  data,
  displayMessage = true,
  disabled
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...rest } }) => (
        <FormItem key={value} {...rest}>
          {label === undefined ? null : label === '' ? <div></div> : <FormLabel>{label}</FormLabel>}
          <Select disabled={disabled} value={value ? String(value) : ''} onValueChange={onChange}>
            <SelectTrigger
              className={clsx(
                'w-full !h-10 border', // default border
                // error ? 'border-red-500' : 'border-gray-300',
                // 'border-red-500',
                className
              )}
              disabled={disabled}
            >
              {prefix && <span className="text-sm">{prefix}</span>}
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {data.map((item) => (
                <SelectItem key={item.value} value={String(item.value)} disabled={item.disabled}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {displayMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
