import { useState, useEffect, useMemo, useRef } from 'react';
import { useFieldArray, useForm, type UseFieldArrayReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router';
import type { CategoryInputProps } from '@/lib/schema/category-schema';
import {
  productSchema,
  type ProductInputProps,
  type ProductSchemaProps
} from '@/lib/schema/product-schema';
import { useCreateProductMutation } from '@/hooks/mutations/use-create-product-mutation';
import { useUpdateProductMutation } from '@/hooks/mutations/use-update-product-mutation';
import useCategoryQuery from '@/hooks/query/use-category-query';
import useProductOptionListQuery from '@/hooks/query/use-product-option-list-query';
import useProductDetailQuery from '@/hooks/query/use-product-detail-query';

function sanitizeEquipmentImages(images: unknown[] | undefined): (File | string)[] {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (img): img is File | string =>
      img instanceof File || (typeof img === 'string' && img.trim().length > 0)
  );
}

export function useProductForm() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id') ?? '';
  const isEditMode = Boolean(productId);

  const [profileImage, setProfileImage] = useState<{ url: string; file?: File } | undefined>();
  const [productOptionRows, setProductOptionRows] = useState<DraggableComboBoxProps[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const productOptionRowsInitialized = useRef(false);

  const { mutate: createProduct, isPending: isCreatePending } = useCreateProductMutation();
  const { mutate: updateProduct, isPending: isUpdatePending } = useUpdateProductMutation();
  const isPending = isEditMode ? isUpdatePending : isCreatePending;

  const { data: categoryList = [] } = useCategoryQuery();
  const { data: productOptionList = [] } = useProductOptionListQuery({ assignable: true });
  const { data: productData } = useProductDetailQuery(productId, { enabled: isEditMode });

  const productOptionSelectOptions = useMemo(
    () => productOptionList.map((o) => ({ label: o.nameEn, value: String(o.id) })),
    [productOptionList]
  );

  const form = useForm<ProductInputProps, unknown, ProductSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { en: '', km: '', vi: '', tw: '', cn: '' },
      status: 'true',
      categoryIds: [],
      taskInformation: [],
      selectedProductOptions: [],
      equipments: [],
      equipment_images: []
    }
  });

  // TaskInformationPanel is typed to CategoryInputProps; both schemas share the same taskInformation shape.
  const control = form.control as unknown as import('react-hook-form').Control<CategoryInputProps>;

  const fieldArray = useFieldArray({
    control: form.control,
    name: 'taskInformation'
  }) as unknown as UseFieldArrayReturn<CategoryInputProps, 'taskInformation', 'id'>;

  useEffect(() => {
    if (!productData || !isEditMode) return;

    const transformTaskInfo = () => {
      const enItems = productData.taskInfoEn ?? [];
      return enItems.map((enItem, index) => ({
        id: `task-${index}`,
        value: {
          en: { title: enItem.key, description: enItem.value.map((v) => ({ value: v })) },
          km: {
            title: productData.taskInfoKm?.[index]?.key ?? '',
            description: (productData.taskInfoKm?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          vi: {
            title: productData.taskInfoVi?.[index]?.key ?? '',
            description: (productData.taskInfoVi?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          cn: {
            title: productData.taskInfoCn?.[index]?.key ?? '',
            description: (productData.taskInfoCn?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          tw: {
            title: productData.taskInfoTw?.[index]?.key ?? '',
            description: (productData.taskInfoTw?.[index]?.value ?? []).map((v) => ({ value: v }))
          }
        }
      }));
    };

    form.reset({
      name: {
        en: productData.nameEn || '',
        km: productData.nameKm || '',
        vi: productData.nameVi || '',
        cn: productData.nameCn || '',
        tw: productData.nameTw || ''
      },
      iconUrl: productData.iconUrl || '',
      status: productData.status ? 'true' : 'false',
      categoryIds: productData.categoryId ? [String(productData.categoryId)] : [],
      taskInformation: transformTaskInfo(),
      selectedProductOptions: [],
      equipments: [],
      equipment_images: []
    });

    setProfileImage(productData.iconUrl ? { url: productData.iconUrl } : undefined);
  }, [productData, isEditMode, form]);

  useEffect(() => {
    if (!productData || !isEditMode) return;
    if (productOptionRowsInitialized.current) return;
    if (!productData.productOptionV2s) return;

    const options = productData.productOptionV2s;

    const existingAsSelectOptions = options.map((opt) => ({
      label: opt.nameEn,
      value: String(opt.id)
    }));
    const mergedSelectOptions = [
      ...existingAsSelectOptions,
      ...productOptionSelectOptions.filter(
        (o) => !existingAsSelectOptions.some((e) => e.value === o.value)
      )
    ];

    setProductOptionRows(
      options.map((opt) => ({
        id: String(opt.id),
        isNew: false,
        data: mergedSelectOptions,
        value: String(opt.id),
        amount: String(opt.amount)
      }))
    );
    productOptionRowsInitialized.current = true;
  }, [productData, isEditMode, productOptionSelectOptions]);

  const onSubmit = (values: ProductSchemaProps) => {
    const equipment_images = sanitizeEquipmentImages(values.equipment_images as unknown[]);

    const existingUrls = equipment_images.filter((img): img is string => typeof img === 'string');
    const newFiles = equipment_images.filter((img): img is File => img instanceof File);
    const equipments = newFiles.map((file, index) => ({
      name: file.name.replace(/\.[^/.]+$/, ''),
      status: true,
      sort: existingUrls.length + index
    }));

    const selectedProductOptions = productOptionRows
      .filter((row) => row.value)
      .map((row) => ({ id: Number(row.value), amount: row.amount ?? '' }));

    const payload: ProductSchemaProps = {
      ...values,
      iconUrl: profileImage?.file ?? values.iconUrl,
      equipment_images,
      equipments,
      selectedProductOptions
    };

    if (isEditMode) {
      updateProduct({ ...payload, id: productId });
    } else {
      createProduct(payload);
    }
  };

  const handleClick = (index?: number) => {
    setSelectedIndex(index !== undefined ? Number(index) : undefined);
    setOpen(true);
  };

  return {
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
  };
}
