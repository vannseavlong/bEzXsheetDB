import { Card, CardContent } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form } from '@/components/ui/form';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import DraggableComboboxPanel from '@/components/common/draggable/draggable-combobox-panel';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import { TaskInformationDialog } from '@/components/category/task-information/task-information-dialog';
import TaskInformationPanel from '@/components/category/task-information/task-information-panel';
import CategoryAddonPanel from '@/components/category/category-addon-panel';
import { CategoryDetailsCard } from '@/components/category/category-details-card';
import { useCategoryForm } from '@/hooks/use-category-form';
import type { TaskInformationSchemaProps } from '@/lib/schema/category-schema';

export default function NewCategory() {
  const { t } = useTranslation();
  const {
    form,
    control,
    fieldArray,
    profileImage,
    setProfileImage,
    products,
    setProducts,
    categoryAddOn,
    setCategoryAddOn,
    open,
    setOpen,
    selectedIndex,
    onSubmit,
    handleClick,
    isPending,
    isEditMode,
    productOptions,
    groupAddonOptions
  } = useCategoryForm();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log({ err });
          })}
        >
          <CustomHeader
            buttonText={isEditMode ? 'Update' : 'save'}
            onSave={form.handleSubmit(onSubmit, (err) => {
              console.log({ err });
            })}
            isLoading={isPending}
          />
          <ContentWrapper>
            <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-start">
              <CategoryDetailsCard
                form={form}
                control={control}
                profileImage={profileImage}
                onProfileImageChange={setProfileImage}
              />

              <div className="w-full lg:w-92 flex flex-col gap-4">
                <TaskInformationPanel
                  title={t('categoryPage.taskInformation')}
                  control={control}
                  name="taskInformation"
                  onClick={handleClick}
                  fieldArray={fieldArray}
                />

                <DraggableComboboxPanel
                  title={t('categoryPage.product')}
                  buttonText={t('categoryPage.addProduct')}
                  data={products}
                  onChange={setProducts}
                  options={productOptions}
                />

                <CategoryAddonPanel
                  title={t('categoryPage.categoryAddOn')}
                  buttonText={t('categoryPage.addCategoryAddOn')}
                  data={categoryAddOn}
                  onChange={setCategoryAddOn}
                  groupOptions={groupAddonOptions}
                />

                <Card>
                  <CardContent>
                    <FormInputMultipleLanguages
                      form={form}
                      name="note"
                      label="Note"
                      placeholder="Note"
                      isTextArea
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </ContentWrapper>
        </form>
      </Form>

      {open && (
        <TaskInformationDialog
          open={open}
          setOpen={setOpen}
          value={
            selectedIndex !== undefined
              ? form.getValues(`taskInformation.${selectedIndex}.value`)
              : undefined
          }
          title={t('categoryPage.taskInformation')}
          onSave={(data: TaskInformationSchemaProps) => {
            const toInput = (output: TaskInformationSchemaProps) => ({
              en: {
                title: output.en.title,
                description: output.en.description.map((v) => ({ value: v }))
              },
              km: {
                title: output.km.title,
                description: output.km.description.map((v) => ({ value: v }))
              },
              vi: {
                title: output.vi.title,
                description: output.vi.description.map((v) => ({ value: v }))
              },
              tw: {
                title: output.tw.title,
                description: output.tw.description.map((v) => ({ value: v }))
              },
              cn: {
                title: output.cn.title,
                description: output.cn.description.map((v) => ({ value: v }))
              }
            });
            if (selectedIndex !== undefined) {
              fieldArray.update(selectedIndex, {
                id: fieldArray.fields[selectedIndex].id,
                value: toInput(data)
              });
            } else {
              fieldArray.append({ id: Date.now().toString(), value: toInput(data) });
            }
            form.trigger('taskInformation');
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
