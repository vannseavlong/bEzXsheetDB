import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import FormInput from '../common/form-input';
import FormTextareaPopOver from '../common/form-textarea-popover';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  label: string;
  placeholder?: string;
  name: Path<T>;
  qtyName: Path<T>;
};

export default function FormInputWithQty<T extends FieldValues>({
  form,
  label,
  placeholder,
  name,
  qtyName
}: Props<T>) {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1">
        <FormTextareaPopOver form={form} name={name} label={label} placeholder={placeholder} />
      </div>
      <div className="w-13">
        <FormInput control={form.control} name={qtyName} label="" placeholder="Qty" />
      </div>
    </div>
  );
}
