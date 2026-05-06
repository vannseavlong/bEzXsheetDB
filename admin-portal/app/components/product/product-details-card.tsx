import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import ProfilePicker from '@/components/common/profile-picker';
import CustomSelect from '@/components/common/custom-select';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
// import DragDropFileUpload from '@/components/common/drag-drop-file-upload';
import { useTranslation } from 'react-i18next';
import type { UseFormReturn, Control } from 'react-hook-form';
import type { ProductInputProps, ProductSchemaProps } from '@/lib/schema/product-schema';

type ProductDetailsCardProps = {
  form: UseFormReturn<ProductInputProps, unknown, ProductSchemaProps>;
  profileImage: { url: string; file?: File } | undefined;
  onProfileImageChange: (payload: { url: string; file?: File }) => void;
  categories: CategoryAttributes[];
};

export function ProductDetailsCard({
  form,
  profileImage,
  onProfileImageChange,
  categories
}: ProductDetailsCardProps) {
  const control = form.control as unknown as Control<ProductInputProps>;
  const { t } = useTranslation();

  const categoryOptions = categories.map((c) => ({
    label: c.nameEn ?? String(c.id),
    value: String(c.id)
  }));

  return (
    <Card className="flex flex-col w-full lg:flex-1">
      <CardHeader className="gap-4">
        <CardTitle>{t('productPage.details')}</CardTitle>
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

          <FormField
            control={control}
            name="categoryIds"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>
                <CustomSelect
                  className="h-10!"
                  placeholder="Select category"
                  data={categoryOptions}
                  value={field.value?.[0] ?? ''}
                  onValueChange={(v) => field.onChange(v ? [v] : [])}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="mt-6">
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
        </div> */}
      </CardContent>
    </Card>
  );
}
