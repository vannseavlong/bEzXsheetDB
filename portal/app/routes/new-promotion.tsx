import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import DragDropFileUpload from '@/components/common/drag-drop-file-upload';
import DraggableInputPanel from '@/components/common/draggable/draggable-input-panel';
import { useState } from 'react';
import DraggableComboboxPanel from '@/components/common/draggable/draggable-combobox-panel';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import { productSchema, type ProductSchemaProps } from '@/lib/schema/product-schema';
import MultipleSelectSearch from '@/components/common/multiple-select-search';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormInput from '@/components/common/form-input';

export default function NewProduct() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [products, setProducts] = useState<DraggableComboBoxProps[]>([]);

  const form = useForm<ProductSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      status: 'Active',
      categories: [],
      attachments: []
    }
  });

  const onSubmit = async (values: ProductSchemaProps) => {
    console.log('Form submitted with values:', values);
    // Here you would typically handle the form submission, e.g., calling an API
  };

  return (
    <div>
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />
      <ContentWrapper>
        <div className="p-6 flex flex-row gap-6 items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="gap-4">
              <CardTitle>{t('productPage.details')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <FormInputMultipleLanguages
                      form={form}
                      name="name"
                      label="Name"
                      placeholder="Name"
                    />
                    <FormInput
                      control={form.control}
                      name="price"
                      label={t('Price')}
                      placeholder={t('Price')}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Status</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder="Status"
                            data={[
                              { label: 'Active', value: 'Active' },
                              { label: 'Resigned', value: 'Resigned' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Category</FormLabel>
                          <MultipleSelectSearch
                            data={[
                              { value: 'Electronics', label: 'Electronics' },
                              { value: 'Books', label: 'Books' },
                              { value: 'Clothing', label: 'Clothing' },
                              { value: 'Home Goods', label: 'Home Goods' },
                              { value: 'Sports & Outdoors', label: 'Sports & Outdoors' },
                              { value: 'Toys & Games', label: 'Toys & Games' },
                              { value: 'Food & Groceries', label: 'Food & Groceries' }
                            ]}
                            placeholder="Select category..."
                            onValueChange={field.onChange}
                            value={field.value}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="mt-4">
                    <DragDropFileUpload placeholder="What's Included" />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="w-[368px] flex flex-col gap-4 h-full">
            <DraggableInputPanel
              title={t('productPage.taskInformation')}
              data={tasks}
              onChange={setTasks}
            />
            <DraggableComboboxPanel
              title={t('productPage.productOption')}
              buttonText={t('productPage.addProductOption')}
              data={products}
              onChange={setProducts}
            />
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
