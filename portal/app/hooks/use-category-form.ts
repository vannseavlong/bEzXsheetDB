import { useState, useEffect, useMemo } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router';
import {
  categorySchema,
  type CategoryInputProps,
  type CategorySchemaProps
} from '@/lib/schema/category-schema';
import { useCreateCategory } from '@/hooks/mutations/use-create-category-mutation';
import { useEditCategoryMutation } from '@/hooks/mutations/use-edit-category-mutation';
import useProductListQuery from '@/hooks/query/use-product-list-query';
import useViewCategoryQuery from '@/hooks/query/use-view-category-query';
import useViewGroupAddonQuery from '@/hooks/query/use-view-group-addon-query';
import type { AddonGroupState } from '@/components/category/category-addon-panel';

function sanitizeEquipmentImages(images: unknown[] | undefined): (File | string)[] {
  if (!Array.isArray(images)) return [];
  return images.filter(
    (img): img is File | string =>
      img instanceof File || (typeof img === 'string' && img.trim().length > 0)
  );
}

export function useCategoryForm() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('id') ?? '';
  const isEditMode = Boolean(categoryId);

  const [profileImage, setProfileImage] = useState<{ url: string; file?: File } | undefined>();
  const [products, setProducts] = useState<DraggableComboBoxProps[]>([]);
  const [categoryAddOn, setCategoryAddOn] = useState<AddonGroupState[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);

  const { mutate: createCategory, isPending: isCreatePending } = useCreateCategory();
  const { mutate: editCategory, isPending: isEditPending } = useEditCategoryMutation();
  const isPending = isEditMode ? isEditPending : isCreatePending;

  const { data: productListData } = useProductListQuery({ assignable: true });
  const { data: groupAddonListData } = useViewGroupAddonQuery(true);
  const { data: categoryData } = useViewCategoryQuery(categoryId, { enabled: isEditMode });

  const productOptions = useMemo(
    () => productListData?.map((p) => ({ label: p.nameEn, value: String(p.id) })) ?? [],
    [productListData]
  );

  const groupAddonOptions = useMemo(() => {
    const baseOptions =
      groupAddonListData?.map((g) => ({ label: g.nameEn, value: String(g.id) })) ?? [];
    if (!categoryData?.productAddOnGroups?.length) return baseOptions;
    const merged = [...baseOptions];
    categoryData.productAddOnGroups.forEach((group) => {
      if (!merged.some((opt) => opt.value === String(group.id))) {
        merged.push({ label: group.nameEn, value: String(group.id) });
      }
    });
    return merged;
  }, [groupAddonListData, categoryData?.productAddOnGroups]);

  const form = useForm<CategoryInputProps, unknown, CategorySchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { en: '', km: '', vi: '', tw: '', cn: '' },
      note: { en: '', km: '', vi: '', tw: '', cn: '' },
      status: 'true',
      isComingSoon: false,
      isRecommended: false,
      hasQty: false,
      taskInformation: [],
      productIds: [],
      productAddOnGroups: [],
      equipments: [{ name: '', status: true, sort: 0 }],
      equipment_images: []
    }
  });

  const control = form.control as unknown as import('react-hook-form').Control<CategoryInputProps>;

  const fieldArray = useFieldArray({ control: form.control, name: 'taskInformation' });

  useEffect(() => {
    if (!categoryData || !isEditMode) return;

    const transformTaskInfo = () => {
      const enItems = categoryData.taskInfoEn ?? [];
      return enItems.map((enItem, index) => ({
        id: `task-${index}`,
        value: {
          en: { title: enItem.key, description: enItem.value.map((v) => ({ value: v })) },
          km: {
            title: categoryData.taskInfoKm?.[index]?.key ?? '',
            description: (categoryData.taskInfoKm?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          vi: {
            title: categoryData.taskInfoVi?.[index]?.key ?? '',
            description: (categoryData.taskInfoVi?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          cn: {
            title: categoryData.taskInfoCn?.[index]?.key ?? '',
            description: (categoryData.taskInfoCn?.[index]?.value ?? []).map((v) => ({ value: v }))
          },
          tw: {
            title: categoryData.taskInfoTw?.[index]?.key ?? '',
            description: (categoryData.taskInfoTw?.[index]?.value ?? []).map((v) => ({ value: v }))
          }
        }
      }));
    };

    const selectedGroupAddons: AddonGroupState[] = (categoryData.productAddOnGroups ?? []).map(
      (group, index) => ({
        id: `${group.id}-${index}`,
        groupId: group.id.toString(),
        addOns: (group.addOns ?? []).map((item) => item.id.toString())
      })
    );

    form.reset({
      name: {
        en: categoryData.nameEn || '',
        km: categoryData.nameKm || '',
        vi: categoryData.nameVi || '',
        cn: categoryData.nameCn || '',
        tw: categoryData.nameTw || ''
      },
      iconUrl: categoryData.iconUrl || '',
      status: categoryData.status ? 'true' : 'false',
      isComingSoon: categoryData.isComingSoon || false,
      isRecommended: categoryData.isRecommended || false,
      hasQty: categoryData.hasQty || false,
      note: {
        en: categoryData.noteEn || '',
        km: categoryData.noteKm || '',
        vi: categoryData.noteVi || '',
        cn: categoryData.noteCn || '',
        tw: categoryData.noteTw || ''
      },
      taskInformation: transformTaskInfo(),
      productIds: (categoryData.products ?? []).map((p) => p.id.toString()),
      equipments: (categoryData.productEquipments ?? []).map((e) => ({
        name: e.name,
        status: e.status,
        sort: e.sort
      })),
      equipment_images: sanitizeEquipmentImages(
        (categoryData.productEquipments ?? []).map((e) => e.imgUrl)
      )
    });

    setProfileImage(categoryData.iconUrl ? { url: categoryData.iconUrl } : undefined);
    setCategoryAddOn(selectedGroupAddons);
  }, [categoryData, isEditMode, form]);

  useEffect(() => {
    if (!categoryData || !isEditMode) return;

    const selectedProducts: DraggableComboBoxProps[] = (categoryData.products ?? []).map(
      (product) => {
        const productId = product.id.toString();
        const inOptions = productOptions.some((opt) => opt.value === productId);
        const data = inOptions
          ? productOptions
          : [...productOptions, { label: product.nameEn, value: productId }];
        return { id: productId, data, value: productId, isNew: false };
      }
    );

    setProducts(selectedProducts);
  }, [categoryData, isEditMode, productOptions]);

  const onSubmit = (values: CategorySchemaProps) => {
    const productIds = products.map((p) => p.value).filter(Boolean);

    const productAddOnGroups = categoryAddOn
      .filter((g) => Boolean(g.groupId))
      .map((group) => ({
        groupId: Number(group.groupId),
        addOns: group.addOns.map((itemId) => Number(itemId))
      }));

    const equipment_images = sanitizeEquipmentImages(values.equipment_images as unknown[]);

    // Only derive equipment metadata for newly uploaded files.
    // Existing equipment (URL strings) are already persisted in the DB — sending metadata
    // for them without an id causes the backend to INSERT duplicates on every save.
    const existingUrls = equipment_images.filter((img): img is string => typeof img === 'string');
    const newFiles = equipment_images.filter((img): img is File => img instanceof File);
    const equipments = newFiles.map((file, index) => ({
      name: file.name.replace(/\.[^/.]+$/, ''),
      status: true,
      sort: existingUrls.length + index
    }));

    const payload: CategorySchemaProps = {
      ...values,
      iconUrl: profileImage?.file ?? values.iconUrl,
      equipment_images,
      equipments,
      productIds,
      productAddOnGroups
    };

    console.log({ payload });

    if (isEditMode) {
      editCategory({ ...payload, id: categoryId });
    } else {
      createCategory(payload);
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
    groupAddonOptions,
    categoryData
  };
}
