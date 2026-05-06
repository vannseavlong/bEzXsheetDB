const multiLangFields = ['en', 'km', 'vi', 'tw', 'cn'] as const;

type MultiLangValue = ProductAddOnLangValue;

type AddOnItemValue = ProductAddOnItemFormAttributes;

type AddOnGroupValue = ProductAddOnGroupFormAttributes & { id?: string | number };

type AddOnItemMeta = {
  nameEn: string;
  nameKm: string;
  nameVi: string;
  nameTw: string;
  nameCn: string;
  amount: string;
  duration: string;
  status: boolean;
  type: 'SINGLE' | 'MULTIPLE';
  sort: number;
  imgUrl?: string;
};

const appendMultiLangFields = (
  formData: FormData,
  prefix: 'name' | 'badge',
  values: MultiLangValue
) => {
  multiLangFields.forEach((lang) => {
    formData.append(`${prefix}${lang[0].toUpperCase()}${lang.slice(1)}`, values[lang] ?? '');
  });
};

const appendAddOnItem = (item: AddOnItemValue, index: number) => {
  const meta: AddOnItemMeta = {
    nameEn: item.name.en ?? '',
    nameKm: item.name.km ?? '',
    nameVi: item.name.vi ?? '',
    nameTw: item.name.tw ?? '',
    nameCn: item.name.cn ?? '',
    amount: item.amount ?? '',
    duration: item.duration ?? '',
    status: Boolean(item.status),
    type: item.type,
    sort: index + 1
  };

  if (typeof item.imgUrl === 'string' && item.imgUrl.trim()) {
    meta.imgUrl = item.imgUrl;
  }

  return meta;
};

export const buildProductAddOnGroupFormData = (payload: AddOnGroupValue) => {
  const formData = new FormData();

  if (payload.id !== undefined) {
    formData.append('id', payload.id.toString());
  }

  appendMultiLangFields(formData, 'name', payload.name);
  appendMultiLangFields(formData, 'badge', payload.badge);
  formData.append('selectionType', payload.selectionType);
  formData.append('isRequired', String(payload.isRequired));

  // Build metadata array for addOns and append images separately as `addOns_images`
  const addOnsMeta = payload.addOns.map((item, index) => appendAddOnItem(item, index));
  formData.append('addOns', JSON.stringify(addOnsMeta));

  // Append image files (if any) using the `addOns_images` key so backend can map files to items by order
  payload.addOns.forEach((item) => {
    if (item.imgUrl instanceof File) {
      formData.append('addOns_images', item.imgUrl);
    }
  });

  return formData;
};
