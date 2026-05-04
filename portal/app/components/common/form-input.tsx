import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { PasswordInput } from './password-input';
import { sanitizeNumberInput } from '@/lib/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<T extends FieldValues, TTransformed = any> = {
  control?: Control<T, unknown, TTransformed>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: 'password' | 'text' | 'decimal' | 'number';
  displayMessage?: boolean;
  className?: string;
  labelClassName?: string;
  disabled?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormInput<T extends FieldValues, TTransformed = any>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  displayMessage = true,
  className,
  labelClassName,
  disabled
}: Props<T, TTransformed>) {
  // Cast to 2-generic Control to satisfy FormField prop type
  const ctrl = control as unknown as Control<T>;
  return (
    <FormField
      control={ctrl}
      name={name}
      render={({ field: { onChange, ...rest } }) => (
        <FormItem>
          {label === undefined ? null : label === '' ? (
            <div className="h-3.5" />
          ) : (
            <FormLabel className={labelClassName}>{label}</FormLabel>
          )}
          <FormControl>
            {type === 'password' ? (
              <PasswordInput
                disabled={disabled}
                placeholder={placeholder}
                onChange={onChange}
                {...rest}
              />
            ) : (
              <Input
                disabled={disabled}
                className={className}
                placeholder={placeholder}
                type={type === 'decimal' || type === 'number' ? 'text' : type}
                inputMode={
                  type === 'decimal' ? 'decimal' : type === 'number' ? 'numeric' : undefined
                }
                pattern={type === 'decimal' || type === 'number' ? '[0-9]*' : undefined}
                onChange={(e) => {
                  if (type === 'number' || type === 'decimal') {
                    e.target.value = sanitizeNumberInput(e.target.value);
                  }
                  onChange(e);
                }}
                {...rest}
              />
            )}
          </FormControl>
          {displayMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
