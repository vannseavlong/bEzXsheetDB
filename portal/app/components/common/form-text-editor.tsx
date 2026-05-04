import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { RichTextEditor } from '../ui/text-editor';

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  displayMessage?: boolean;
  className?: string;
  disabled?: boolean;
};

export default function FormTextEditor<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  displayMessage = true,
  className,
  disabled
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { onChange, value, ...rest } }) => (
        <FormItem>
          {label === undefined ? null : label === '' ? (
            <div className="h-3.5" />
          ) : (
            <FormLabel>{label}</FormLabel>
          )}
          <FormControl>
            <RichTextEditor
              disabled={disabled}
              className={className}
              placeholder={placeholder}
              onChange={onChange}
              value={value}
              {...rest}
            />
          </FormControl>
          {displayMessage && <FormMessage />}
        </FormItem>
      )}
    />
  );
}
