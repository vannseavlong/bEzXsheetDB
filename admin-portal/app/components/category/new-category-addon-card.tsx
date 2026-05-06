import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grip, Minus } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FormInputMultipleLanguages from '../common/form-input-multiple-languages';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import CustomSelect from '../common/custom-select';
import ProfilePicker from '../common/profile-picker';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  nameName: Path<T>;
  amountName: Path<T>;
  durationName: Path<T>;
  statusName: Path<T>;
  typeName: Path<T>;
  imgUrlName: Path<T>;
  id?: string;
  title?: string;
  onDelete?: () => void;
};

export default function NewCategoryAddonCard<T extends FieldValues>({
  form,
  nameName,
  amountName,
  durationName,
  statusName,
  typeName,
  imgUrlName,
  id,
  title,
  onDelete
}: Props<T>) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: id || ''
  });
  const imageValue = form.watch(imgUrlName as Path<T>) as string | File | undefined;

  const previewUrl = useMemo(() => {
    if (imageValue instanceof File) {
      return URL.createObjectURL(imageValue);
    }

    if (typeof imageValue === 'string' && imageValue.trim()) {
      return imageValue;
    }

    return '';
  }, [imageValue]);

  useEffect(() => {
    if (!(imageValue instanceof File) || !previewUrl) return;

    return () => URL.revokeObjectURL(previewUrl);
  }, [imageValue, previewUrl]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      {id && (
        <div className="mb-4 flex flex-row gap-3">
          <button
            className="cursor-grab p-1 text-gray-400 hover:text-gray-600 active:cursor-grabbing"
            type="button"
            {...attributes}
            {...listeners}
          >
            <Grip className="h-4 w-4" />
          </button>
          <div className="flex-1">{title}</div>
          <button type="button" onClick={onDelete} className="p-1 text-red-400">
            <Minus className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[96px_minmax(0,1fr)] gap-6 items-start">
        <FormField
          control={form.control}
          name={imgUrlName}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 items-start">
              {/* <FormLabel>{t('Image')}</FormLabel> */}
              <FormControl>
                <ProfilePicker
                  image={typeof field.value === 'string' ? field.value : previewUrl}
                  setImage={({ file }) => field.onChange(file)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormInputMultipleLanguages form={form} name={nameName} label="Name" placeholder="Name" />

          <FormField
            control={form.control}
            name={amountName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Amount')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Amount')} type="decimal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={durationName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Duration')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('Duration')} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={statusName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('Status')}</FormLabel>
                <CustomSelect
                  placeholder={t('Status')}
                  value={field.value ? 'true' : 'false'}
                  onValueChange={(value) => field.onChange(value === 'true')}
                  data={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' }
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={typeName}
            render={({ field }) => (
              <FormItem className="lg:col-span-1">
                <FormLabel>{t('Type')}</FormLabel>
                <CustomSelect
                  placeholder={t('Type')}
                  value={field.value}
                  onValueChange={field.onChange}
                  data={[
                    { label: 'SINGLE', value: 'SINGLE' },
                    { label: 'MULTIPLE', value: 'MULTIPLE' }
                  ]}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
