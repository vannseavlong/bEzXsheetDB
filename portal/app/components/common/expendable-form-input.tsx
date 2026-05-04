import type { Control, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '../ui/textarea';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export default function ExpandableFormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return <Input field={field} label={label} placeholder={placeholder} />;
      }}
    />
  );
}

type ItemProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, Path<T>>;
  className?: string;
  label: string;
  placeholder?: string;
};

function Input<T extends FieldValues>({ field, className, label, placeholder }: ItemProps<T>) {
  const { value, onChange, onBlur } = field;
  const maxRows = 8;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const adjustHeight = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);
      const minHeightPx = lineHeight;
      const maxHeightPx = lineHeight * maxRows;

      if (isFocused) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.min(Math.max(scrollHeight, minHeightPx), maxHeightPx);
        textarea.style.height = `${newHeight}px`;
        textarea.style.overflowY = 'hidden';
      } else {
        textarea.style.height = `${minHeightPx}px`;
        textarea.style.overflowY = 'hidden';
      }
    };
    adjustHeight();
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value);

  const handleFocus = () => setIsFocused(true);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur();
  };

  return (
    <FormItem className="flex-1">
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`resize-none transition-all duration-200 min-h-10 ${className}`}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
