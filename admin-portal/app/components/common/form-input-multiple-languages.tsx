import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';
import InputMultipleLangsDialog from './input-multiple-langs-dialog';
import { Textarea } from '../ui/textarea';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<T extends FieldValues, TTransformed = any> = {
  form: UseFormReturn<T, unknown, TTransformed>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showError?: boolean;
  isTextArea?: boolean;
  disabled?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FormInputMultipleLanguages<T extends FieldValues, TTransformed = any>({
  name,
  label,
  placeholder,
  form,
  showError,
  isTextArea,
  disabled
}: Props<T, TTransformed>) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  // Cast to 2-generic Control to satisfy FormField prop type
  const control = form.control as unknown as import('react-hook-form').Control<T>;

  // Pick the first error across all language sub-fields to surface below the input
  const fieldErrors = (
    form.formState.errors as Record<string, Record<string, { message?: string }>>
  )[name as string];
  const firstLangError = fieldErrors && Object.values(fieldErrors).find((e) => e?.message);

  return (
    <>
      <FormField
        control={control}
        name={`${name}.en` as Path<T>}
        render={({ field }) => (
          <FormItem className="flex flex-col flex-1">
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              {isTextArea ? (
                <Textarea
                  placeholder={placeholder}
                  value={field.value}
                  readOnly
                  disabled={disabled}
                  className="cursor-pointer"
                  onClick={() => setIsPopupOpen(true)}
                />
              ) : (
                <Input
                  placeholder={placeholder}
                  value={field.value}
                  readOnly
                  disabled={disabled}
                  className="cursor-pointer"
                  onClick={() => setIsPopupOpen(true)}
                />
              )}
            </FormControl>
            {showError &&
              (firstLangError ? (
                <p className="text-[0.8rem] font-medium text-destructive">
                  {firstLangError.message}
                </p>
              ) : (
                <FormMessage />
              ))}
            <InputMultipleLangsDialog
              form={form}
              name={name}
              label={label}
              isPopupOpen={isPopupOpen}
              setIsPopupOpen={setIsPopupOpen}
            />
          </FormItem>
        )}
      />
    </>
  );
}
