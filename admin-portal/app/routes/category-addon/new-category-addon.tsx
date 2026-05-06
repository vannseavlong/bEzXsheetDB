import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import NewCategoryAddonCard from '@/components/category/new-category-addon-card';
import {
  productAddOnGroupFormSchema,
  type ProductAddOnGroupFormSchemaProps
} from '@/lib/schema/category-addon-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import useViewGroupAddonDetailQuery from '@/hooks/query/use-view-group-addon-detail-query';
import { useCreateProductAddOnGroupMutation } from '@/hooks/mutations/use-create-product-add-on-group-mutation';
import { useUpdateProductAddOnGroupMutation } from '@/hooks/mutations/use-update-product-add-on-group-mutation';
import { toast } from 'sonner';
import CustomSelect from '@/components/common/custom-select';
import { Switch } from '@/components/ui/switch';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';

const createEmptyMultiLang = (): ProductAddOnLangValue => ({
  en: '',
  km: '',
  vi: '',
  tw: '',
  cn: ''
});

const createEmptyAddOnItem = (): ProductAddOnItemFormAttributes => ({
  imgUrl: '',
  name: createEmptyMultiLang(),
  amount: '',
  duration: '',
  status: true,
  type: 'SINGLE'
});

const createEmptyFormValues = (): ProductAddOnGroupFormSchemaProps => ({
  name: createEmptyMultiLang(),
  badge: createEmptyMultiLang(),
  selectionType: 'SINGLE',
  isRequired: true,
  addOns: [createEmptyAddOnItem()]
});

export default function NewCategoryAddon() {
  const { t } = useTranslation();
  const { id: addonId = '' } = useParams();
  const isEditMode = addonId !== '' && addonId !== 'new';
  const createMutation = useCreateProductAddOnGroupMutation();
  const updateMutation = useUpdateProductAddOnGroupMutation();
  const mutation = isEditMode ? updateMutation : createMutation;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const { data: groupDetail } = useViewGroupAddonDetailQuery(addonId, {
    enabled: isEditMode
  });

  const form = useForm<ProductAddOnGroupFormSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(productAddOnGroupFormSchema),
    defaultValues: createEmptyFormValues()
  });

  const { fields, remove, append, move } = useFieldArray({
    control: form.control,
    name: 'addOns'
  });

  useEffect(() => {
    if (!groupDetail || !isEditMode) return;

    form.reset({
      id: groupDetail.id,
      name: {
        en: groupDetail.nameEn || '',
        km: groupDetail.nameKm || '',
        vi: groupDetail.nameVi || '',
        tw: groupDetail.nameTw || '',
        cn: groupDetail.nameCn || ''
      },
      badge: {
        en: groupDetail.badgeEn || '',
        km: groupDetail.badgeKm || '',
        vi: groupDetail.badgeVi || '',
        tw: groupDetail.badgeTw || '',
        cn: groupDetail.badgeCn || ''
      },
      selectionType: groupDetail.selectionType === 'MULTIPLE' ? 'MULTIPLE' : 'SINGLE',
      isRequired: groupDetail.isRequired,
      addOns:
        groupDetail.addOns?.length > 0
          ? groupDetail.addOns.map((item) => ({
              imgUrl: item.imgUrl || '',
              name: {
                en: item.nameEn || '',
                km: item.nameKm || '',
                vi: item.nameVi || '',
                tw: item.nameTw || '',
                cn: item.nameCn || ''
              },
              amount: item.amount?.toString() || '',
              duration: item.duration?.toString() || '',
              status: item.status,
              type: item.type === 'MULTIPLE' ? 'MULTIPLE' : 'SINGLE'
            }))
          : [createEmptyAddOnItem()]
    });
  }, [form, groupDetail, isEditMode]);

  const onSubmit = async (values: ProductAddOnGroupFormSchemaProps) => {
    if (isEditMode) {
      updateMutation.mutate({ ...values, id: addonId });
    } else {
      createMutation.mutate(values);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      move(oldIndex, newIndex);
    }
  };

  const handleClearAll = () => {
    remove();
  };

  const handleAddMore = () => {
    append(createEmptyAddOnItem());
  };

  return (
    <div>
      <CustomHeader
        buttonText={isEditMode ? 'Update' : 'Save'}
        isLoading={mutation.isPending}
        onSave={form.handleSubmit(onSubmit, (error) => {
          const findFirstMessage = (obj: unknown): string | undefined => {
            if (!obj || typeof obj !== 'object') return undefined;
            const record = obj as Record<string, unknown>;
            if (typeof record.message === 'string') return record.message;
            for (const val of Object.values(record)) {
              const msg = findFirstMessage(val);
              if (msg) return msg;
            }
          };
          const message = findFirstMessage(error);
          if (message) toast.error(message);
        })}
      />

      <ContentWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-6">
              <Card className="mb-6">
                <CardHeader className="gap-4">
                  <CardTitle>Group</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInputMultipleLanguages
                      form={form}
                      name="name"
                      label="Name"
                      placeholder="Name"
                    />
                    <FormInputMultipleLanguages
                      form={form}
                      name="badge"
                      label="Badge"
                      placeholder="Badge"
                    />
                    <FormField
                      control={form.control}
                      name="selectionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Selection Type</FormLabel>
                          <CustomSelect
                            placeholder="Selection Type"
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
                    <FormField
                      control={form.control}
                      name="isRequired"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-3 pt-6">
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) => field.onChange(checked === true)}
                            />
                          </FormControl>
                          <FormLabel className="mb-0">Is Required</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6">
                <CardHeader className="p-0">
                  <div className="flex justify-between">
                    <CardTitle>Add-on Items</CardTitle>
                    {fields.length > 0 && (
                      <Button
                        className="text-destructive pr-0! pt-0!"
                        variant="link"
                        type="button"
                        onClick={handleClearAll}
                      >
                        {t('categoryPage.clearAll')}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                {fields.length > 0 && (
                  <CardContent className="p-0">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={fields.map((task) => task.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="flex flex-col gap-6 divide-accent divide-y-2">
                          {fields.map((field, index) => (
                            <div key={field.id} className="pb-6">
                              <NewCategoryAddonCard
                                id={field.id}
                                title={`Item ${index + 1}`}
                                nameName={`addOns.${index}.name`}
                                amountName={`addOns.${index}.amount`}
                                durationName={`addOns.${index}.duration`}
                                statusName={`addOns.${index}.status`}
                                typeName={`addOns.${index}.type`}
                                imgUrlName={`addOns.${index}.imgUrl`}
                                form={form}
                                onDelete={() => {
                                  remove(index);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                )}
                <CardFooter className="justify-end">
                  <Button
                    type="button"
                    variant="link"
                    className="pr-0! pb-0!"
                    onClick={handleAddMore}
                  >
                    <Plus />
                    Add another item
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </form>
        </Form>
      </ContentWrapper>
    </div>
  );
}
