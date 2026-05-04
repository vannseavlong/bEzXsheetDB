import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ProfilePicker from '@/components/common/profile-picker';
import CustomSelect from '@/components/common/custom-select';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import { Switch } from '@/components/ui/switch';
import DragDropFileUpload from '@/components/common/drag-drop-file-upload';
import { useTranslation } from 'react-i18next';
import type { UseFormReturn, Control } from 'react-hook-form';
import type { CategoryInputProps, CategorySchemaProps } from '@/lib/schema/category-schema';

type CategoryDetailsCardProps = {
  form: UseFormReturn<CategoryInputProps, unknown, CategorySchemaProps>;
  control: Control<CategoryInputProps>;
  profileImage: { url: string; file?: File } | undefined;
  onProfileImageChange: (payload: { url: string; file?: File }) => void;
};

export function CategoryDetailsCard({
  form,
  control,
  profileImage,
  onProfileImageChange
}: CategoryDetailsCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="flex flex-col w-full lg:flex-1">
      <CardHeader className="gap-4">
        <CardTitle>{t('categoryPage.details')}</CardTitle>
        <FormField
          control={control}
          name="iconUrl"
          render={({ fieldState }) => (
            <FormItem>
              <FormControl>
                <ProfilePicker
                  image={profileImage?.url}
                  setImage={(payload) => {
                    onProfileImageChange(payload);
                    form.setValue('iconUrl', payload.file, { shouldValidate: true });
                  }}
                />
              </FormControl>
              {fieldState.error && <FormMessage />}
            </FormItem>
          )}
        />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-3">
          <FormInputMultipleLanguages
            form={form}
            name="name"
            label="Name"
            placeholder="Name"
            showError
          />

          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Status</FormLabel>
                <CustomSelect
                  className="h-10!"
                  placeholder="Status"
                  data={[
                    { label: 'Active', value: 'true' },
                    { label: 'Inactive', value: 'false' }
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-4 mt-6">
          <FormField
            control={control}
            name="isComingSoon"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 gap-3">
                <FormLabel className="text-sm font-medium leading-none">Coming Soon</FormLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="isRecommended"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 gap-3">
                <FormLabel className="text-sm font-medium leading-none">Recommended</FormLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="hasQty"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 gap-3">
                <FormLabel className="text-sm font-medium leading-none">Has Quantity</FormLabel>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6">
          <FormField
            control={control}
            name="equipment_images"
            render={({ field }) => {
              const existingUrls = Array.isArray(field.value)
                ? field.value.filter((v): v is string => typeof v === 'string')
                : [];
              return (
                <FormItem>
                  <DragDropFileUpload
                    placeholder="Equipment Images"
                    existingUrls={existingUrls}
                    onExistingUrlRemoved={(remaining) => {
                      const files = Array.isArray(field.value)
                        ? field.value.filter((v): v is File => v instanceof File)
                        : [];
                      field.onChange([...remaining, ...files]);
                    }}
                    onFilesChange={(files) => {
                      const urls = Array.isArray(field.value)
                        ? field.value.filter((v): v is string => typeof v === 'string')
                        : [];
                      field.onChange([...urls, ...files]);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
