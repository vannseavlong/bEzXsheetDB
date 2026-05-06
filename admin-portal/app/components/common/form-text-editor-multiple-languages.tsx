import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useEffect, useRef, useState } from 'react';
import TextEditorMultipleLangsDialog from './text-editor-multiple-langs-dialog';
import { RichTextEditor, type LexicalEditorHandle } from '../ui/text-editor';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  showError?: boolean;
  disabled?: boolean;
};

export default function TextEditorMultipleLanguages<T extends FieldValues>({
  name,
  label,
  placeholder,
  form,
  showError,
  disabled
}: Props<T>) {
  const editorRef = useRef<LexicalEditorHandle>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { control, getValues, watch } = form;
  const fieldValue = watch(`${name}.en` as Path<T>);

  useEffect(() => {
    const value = getValues(`${name}.en` as Path<T>);
    if (value) {
      editorRef.current?.setValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPopupOpen, fieldValue]);

  return (
    <FormField
      control={control}
      name={`${name}.en` as Path<T>}
      render={({ field }) => (
        <FormItem className="flex flex-col flex-1">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <RichTextEditor
              ref={editorRef}
              placeholder={placeholder}
              value={field.value}
              readOnly
              disabled={disabled}
              className="cursor-pointer"
              showToolbar={false}
              onClick={() => setIsPopupOpen(true)}
            />
          </FormControl>
          {showError && <FormMessage />}
          <TextEditorMultipleLangsDialog
            form={form}
            name={name}
            label={label}
            isPopupOpen={isPopupOpen}
            setIsPopupOpen={setIsPopupOpen}
          />
        </FormItem>
      )}
    />
  );
}
