import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CategorySchemaProps } from '@/lib/schema/category-schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useCreateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const apiFn = (payload: CategorySchemaProps) => {
    const formData = new FormData();

    // Basic name fields (flattened from nested object)
    formData.append('nameEn', payload.name.en ?? '');
    formData.append('nameKm', payload.name.km ?? '');
    formData.append('nameVi', payload.name.vi ?? '');
    formData.append('nameCn', payload.name.cn ?? '');
    formData.append('nameTw', payload.name.tw ?? '');

    // Icon
    if (payload.iconUrl instanceof File) {
      formData.append('icon_url', payload.iconUrl);
    } else if (typeof payload.iconUrl === 'string' && payload.iconUrl) {
      formData.append('icon_url', payload.iconUrl);
    }

    // Status & flags
    formData.append('status', payload.status);
    formData.append('isComingSoon', String(payload.isComingSoon));
    formData.append('isRecommended', String(payload.isRecommended));
    formData.append('hasQty', String(payload.hasQty));

    // Note fields (flattened from nested object)
    formData.append('noteEn', payload.note?.en ?? '');
    formData.append('noteKm', payload.note?.km ?? '');
    formData.append('noteVi', payload.note?.vi ?? '');
    formData.append('noteCn', payload.note?.cn ?? '');
    formData.append('noteTw', payload.note?.tw ?? '');

    // Task info per language - built from the taskInformation UI field array.
    // Each item.value[lang].description is stored as { value: string }[] (RHF useFieldArray format)
    // and must be mapped to string[] for the API payload.
    const buildTaskInfo = (lang: 'en' | 'km' | 'vi' | 'cn' | 'tw') => {
      if (payload.taskInformation?.length) {
        return payload.taskInformation
          .filter((item) => item.value[lang]?.title)
          .map((item) => {
            return {
              key: item.value[lang]?.title ?? '',
              value: (item.value[lang]?.description ?? []) as string[]
            };
          });
      }
      return null;
    };

    const taskInfoEn = buildTaskInfo('en');
    const taskInfoKm = buildTaskInfo('km');
    const taskInfoVi = buildTaskInfo('vi');
    const taskInfoCn = buildTaskInfo('cn');
    const taskInfoTw = buildTaskInfo('tw');

    if (taskInfoEn?.length) {
      formData.append('taskInfoEn', JSON.stringify(taskInfoEn));
    }
    if (taskInfoKm?.length) {
      formData.append('taskInfoKm', JSON.stringify(taskInfoKm));
    }
    if (taskInfoVi?.length) {
      formData.append('taskInfoVi', JSON.stringify(taskInfoVi));
    }
    if (taskInfoCn?.length) {
      formData.append('taskInfoCn', JSON.stringify(taskInfoCn));
    }
    if (taskInfoTw?.length) {
      formData.append('taskInfoTw', JSON.stringify(taskInfoTw));
    }

    // Product IDs array (sent as JSON string so the server can parse the array)
    if (payload.productIds?.length) {
      formData.append('productIds', JSON.stringify(payload.productIds));
    }

    if (payload.productAddOnGroups?.length) {
      formData.append('productAddOnGroups', JSON.stringify(payload.productAddOnGroups));
    }

    // Equipment metadata (serialized as JSON)
    if (payload.equipments?.length) {
      formData.append('equipments', JSON.stringify(payload.equipments));
    }

    // Equipment images (File or string URL, appended individually)
    if (payload.equipment_images?.length) {
      payload.equipment_images.forEach((img) => {
        if (img instanceof File) {
          formData.append('equipment_images', img);
        } else if (typeof img === 'string' && img) {
          formData.append('equipment_images', img);
        }
      });
    }

    return api.post(API_ENDPOINT.CATEGORY_CREATE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CATEGORY_CREATE],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.CATEGORIES] });
      navigate(-1);
    },
    onError: () => {
      // api.ts interceptor already shows a toast for all API errors;
      // no need to show a duplicate here
    }
  });
}
