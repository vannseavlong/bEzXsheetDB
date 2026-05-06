import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ProductSchemaProps } from '@/lib/schema/product-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function buildProductFormData(payload: ProductSchemaProps): FormData {
  const formData = new FormData();

  formData.append('nameEn', payload.name.en ?? '');
  formData.append('nameKm', payload.name.km ?? '');
  formData.append('nameVi', payload.name.vi ?? '');
  formData.append('nameCn', payload.name.cn ?? '');
  formData.append('nameTw', payload.name.tw ?? '');

  if (payload.iconUrl instanceof File) {
    formData.append('icon_url', payload.iconUrl);
  } else if (typeof payload.iconUrl === 'string' && payload.iconUrl) {
    formData.append('icon_url', payload.iconUrl);
  }

  formData.append('status', payload.status);

  if (payload.categoryIds?.length) {
    formData.append('categoryIds', JSON.stringify(payload.categoryIds));
  }

  const buildTaskInfo = (lang: 'en' | 'km' | 'vi' | 'cn' | 'tw') => {
    if (!payload.taskInformation?.length) return null;
    return payload.taskInformation
      .filter((item) => item.value[lang]?.title)
      .map((item) => ({
        key: item.value[lang]?.title ?? '',
        value: (item.value[lang]?.description ?? []) as string[]
      }));
  };

  const taskInfoEn = buildTaskInfo('en');
  const taskInfoKm = buildTaskInfo('km');
  const taskInfoVi = buildTaskInfo('vi');
  const taskInfoCn = buildTaskInfo('cn');
  const taskInfoTw = buildTaskInfo('tw');

  if (taskInfoEn?.length) formData.append('taskInfoEn', JSON.stringify(taskInfoEn));
  if (taskInfoKm?.length) formData.append('taskInfoKm', JSON.stringify(taskInfoKm));
  if (taskInfoVi?.length) formData.append('taskInfoVi', JSON.stringify(taskInfoVi));
  if (taskInfoCn?.length) formData.append('taskInfoCn', JSON.stringify(taskInfoCn));
  if (taskInfoTw?.length) formData.append('taskInfoTw', JSON.stringify(taskInfoTw));

  const validOptions = payload.selectedProductOptions
    ?.filter((o) => o.id > 0)
    .map((o) => ({ id: o.id, amount: parseFloat(o.amount) }));
  if (validOptions?.length) {
    formData.append('productOptionV2s', JSON.stringify(validOptions));
  }

  if (payload.equipments?.length) {
    formData.append('equipments', JSON.stringify(payload.equipments));
  }

  if (payload.equipment_images?.length) {
    payload.equipment_images.forEach((img) => {
      if (img instanceof File) {
        formData.append('equipment_images', img);
      } else if (typeof img === 'string' && img) {
        formData.append('equipment_images', img);
      }
    });
  }

  return formData;
}

export function useCreateProductMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PRODUCT_CREATE],
    mutationFn: (payload: ProductSchemaProps) => {
      console.log('[CREATE product payload]', payload);
      const formData = buildProductFormData(payload);
      return api.post(API_ENDPOINT.PRODUCT_CREATE, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Product created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_LIST] });
      navigate(-1);
    },
    onError: () => {}
  });
}
