import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { type Dispatch, type SetStateAction } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog';
import { Button } from '../ui/button';
import FormInput from './form-input';
import { DialogTitle } from '@radix-ui/react-dialog';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props<T extends FieldValues, TTransformed = any> = {
  form: UseFormReturn<T, unknown, TTransformed>;
  name: Path<T>;
  label?: string;
  isPopupOpen: boolean;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function InputMultipleLangsDialog<T extends FieldValues, TTransformed = any>({
  name,
  label,
  form,
  isPopupOpen,
  setIsPopupOpen
}: Props<T, TTransformed>) {
  const { control, trigger, watch } = form;

  const nameValues = watch(name) as Record<string, string> | undefined;
  const isSaveDisabled =
    !nameValues || ['en', 'km', 'vi', 'tw', 'cn'].some((lang) => !(nameValues[lang] ?? '').trim());

  const handleSaveClick = async () => {
    const fieldsToValidate = [`${name}.en`, `${name}.km`, `${name}.vi`, `${name}.tw`, `${name}.cn`];
    const isValid = await trigger(fieldsToValidate as Path<T>[]);
    if (isValid) {
      setIsPopupOpen(false);
    }
  };

  return (
    <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <DialogContent className="p-0 w-[90vw] md:w-[60vw] lg:w-[50vw] max-w-225 mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 border-b sticky top-0 bg-background z-10">
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 pt-0">
          <FormInput
            control={control}
            name={`${name}.en` as Path<T>}
            label="English"
            placeholder="English"
          />
          <FormInput
            control={control}
            name={`${name}.km` as Path<T>}
            label="Khmer"
            placeholder="Khmer"
          />
          <FormInput
            control={control}
            name={`${name}.vi` as Path<T>}
            label="Vietnamese"
            placeholder="Vietnamese"
          />
          <FormInput
            control={control}
            name={`${name}.tw` as Path<T>}
            label="Chinese (Traditional)"
            placeholder="Chinese (Traditional)"
          />
          <FormInput
            control={control}
            name={`${name}.cn` as Path<T>}
            label="Chinese (Simplified)"
            placeholder="Chinese (Simplified)"
          />
        </div>

        <DialogFooter className="pr-4 pb-4 pt-6 border-t sticky bottom-0 bg-background">
          <Button size="sm" type="button" onClick={handleSaveClick} disabled={isSaveDisabled}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
