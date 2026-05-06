import CustomTabs from '@/components/common/custom-tabs';
import DraggableInputBoxPanel from '@/components/common/draggable/draggable-inputbox-panel';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useForm, type Path } from 'react-hook-form';
import {
  taskInformationSchema,
  type TaskInformationInputProps,
  type TaskInformationSchemaProps
} from '@/lib/schema/category-schema';
import FormInput from '@/components/common/form-input';
import { FormControl, FormField, FormItem, FormMessage, Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'Khmer', value: 'km' },
  { label: 'Vietnamese', value: 'vi' },
  { label: 'Chinese (Traditional)', value: 'tw' },
  { label: 'Chinese (Simplified)', value: 'cn' }
];

type Props = {
  title: string;
  onSave: (data: TaskInformationSchemaProps) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: TaskInformationInputProps;
};

export function TaskInformationDialog({ title, onSave, open, setOpen, value }: Props) {
  const { t } = useTranslation();
  const form = useForm<TaskInformationInputProps, unknown, TaskInformationSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(taskInformationSchema),
    defaultValues: value ?? {
      en: { title: '', description: [] },
      km: { title: '', description: [] },
      vi: { title: '', description: [] },
      tw: { title: '', description: [] },
      cn: { title: '', description: [] }
    }
  });

  // const { fields, remove } = fieldArray;
  // const index = fields.length - 1;

  // Cast to 2-generic Control to satisfy FormField and child component prop types
  const control =
    form.control as unknown as import('react-hook-form').Control<TaskInformationInputProps>;

  const watchedValues = form.watch();
  const isDialogFormValid = useMemo(() => {
    const langs = ['en', 'km', 'vi', 'tw', 'cn'] as const;
    return langs.every((lang) => {
      const langData = watchedValues[lang];
      return (langData?.title ?? '').trim().length > 0 && (langData?.description?.length ?? 0) > 0;
    });
  }, [watchedValues]);

  const handleOpenChange = (open: boolean) => {
    // if (!open) {
    //   remove(index);
    // }
    setOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="p-0 w-[75vw] flex flex-col h-[70vh] overflow-hidden gap-0"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSave)}
            className="flex flex-col h-full overflow-hidden"
          >
            <DialogHeader className="p-6 shrink-0">
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden min-h-0">
              <CustomTabs tabs={languages} defaultValue="en">
                {(tab) => (
                  <div className="flex flex-col gap-3">
                    <FormInput
                      placeholder={tab.label}
                      control={control}
                      name={`${tab.value}.title` as Path<TaskInformationInputProps>}
                    />
                    <FormField
                      control={control}
                      name={`${tab.value}.description` as Path<TaskInformationInputProps>}
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <DraggableInputBoxPanel
                              buttonText={t('categoryPage.addProduct')}
                              control={control}
                              name={tab.value as Path<TaskInformationInputProps>}
                              label={tab.label}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CustomTabs>
            </div>
            <DialogFooter className="border-t p-6 shrink-0">
              <Button type="submit" size="sm" disabled={!isDialogFormValid}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
