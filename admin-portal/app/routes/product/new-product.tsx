import { Form } from '@/components/ui/form';
import CustomHeader from '@/components/headers/custom-header';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import { TaskInformationDialog } from '@/components/category/task-information/task-information-dialog';
import TaskInformationPanel from '@/components/category/task-information/task-information-panel';
import { ProductDetailsCard } from '@/components/product/product-details-card';
import DraggableComboboxPanel from '@/components/common/draggable/draggable-combobox-panel';
import { useProductForm } from '@/hooks/use-product-form';
import type { TaskInformationSchemaProps } from '@/lib/schema/product-schema';

export default function NewProduct() {
  const { t } = useTranslation();
  const {
    form,
    control,
    fieldArray,
    profileImage,
    setProfileImage,
    productOptionRows,
    setProductOptionRows,
    productOptionSelectOptions,
    open,
    setOpen,
    selectedIndex,
    onSubmit,
    handleClick,
    isPending,
    isEditMode,
    categoryList
  } = useProductForm();

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log({ err });
          })}
        >
          <CustomHeader
            buttonText={isEditMode ? 'Update' : 'Save'}
            onSave={form.handleSubmit(onSubmit, (err) => {
              console.log({ err });
            })}
            isLoading={isPending}
          />
          <ContentWrapper>
            <div className="p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-start">
              <ProductDetailsCard
                form={form}
                profileImage={profileImage}
                onProfileImageChange={setProfileImage}
                categories={categoryList}
              />

              <div className="w-full lg:min-w-92 lg:w-fit flex flex-col gap-4">
                <TaskInformationPanel
                  title={t('categoryPage.taskInformation')}
                  control={control}
                  name="taskInformation"
                  onClick={handleClick}
                  fieldArray={fieldArray}
                />

                <DraggableComboboxPanel
                  title={t('productPage.productOption')}
                  buttonText={t('productPage.addProductOption')}
                  options={productOptionSelectOptions}
                  data={productOptionRows}
                  onChange={setProductOptionRows}
                  showAmount
                />
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
