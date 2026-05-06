import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { type Dispatch, type SetStateAction } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ui/dialog';
import { Button } from '../ui/button';
import FormTextEditor from './form-text-editor';
import { DialogTitle } from '@radix-ui/react-dialog';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  isPopupOpen: boolean;
  setIsPopupOpen: Dispatch<SetStateAction<boolean>>;
};

export default function TextEditorMultipleLangsDialog<T extends FieldValues>({
  name,
  label,
  form,
  isPopupOpen,
  setIsPopupOpen
}: Props<T>) {
  const { control, trigger } = form;

  const handleSaveClick = async () => {
    const fieldsToValidate = [`${name}.en`, `${name}.km`, `${name}.vi`, `${name}.tw`, `${name}.cn`];
    const isValid = await trigger(fieldsToValidate as Path<T>[]);
    if (isValid) {
      setIsPopupOpen(false);
    }
  };

  return (
    <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
      <DialogContent className="p-0 w-[70vw] max-h-[90vh] flex flex-col">
        <DialogHeader className="p-4 border-b shrink-0">
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4 pt-0 overflow-y-auto flex-1 **:data-[slot=form-item]:flex **:data-[slot=form-item]:flex-col **:data-[slot=rich-text-editor]:flex-1">
          <FormTextEditor
            control={control}
            name={`${name}.en` as Path<T>}
            label="English"
            placeholder="English"
          />
          <FormTextEditor
            control={control}
            name={`${name}.km` as Path<T>}
            label="Khmer"
            placeholder="Khmer"
          />
          <FormTextEditor
            control={control}
            name={`${name}.vi` as Path<T>}
            label="Vietnamese"
            placeholder="Vietnamese"
          />
          <FormTextEditor
            control={control}
            name={`${name}.tw` as Path<T>}
            label="Chinese (Traditional)"
            placeholder="Chinese (Traditional)"
          />
          <FormTextEditor
            control={control}
            name={`${name}.cn` as Path<T>}
            label="Chinese (Simplified)"
            placeholder="Chinese (Simplified)"
          />
        </div>

        <DialogFooter className="pr-4 py-4 border-t shrink-0">
          <Button size="sm" type="button" onClick={handleSaveClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
