import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { CleanerSchemaProps } from '@/lib/schema/cleaner-schema';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useCreateCleanerMutation(id?: string) {
  const navigate = useNavigate();

  const apiFn = (payload: CleanerSchemaProps): Promise<Blob> => {
    const formData = new FormData();

    // Append normal fields

    formData.append('cleanerName', payload.cleanerName);
    if (payload.image) {
      if (payload.image?.file) {
        formData.append('image', payload.image.file);
      } else if (payload.image?.url) {
        formData.append('image', payload.image.url);
      }
    }
    formData.append('status', String(payload.status === 'Active'));
    formData.append('gender', payload.gender);
    formData.append('autoAssign', String(payload.autoAssign));
    formData.append('role', payload.role);
    formData.append('cleanerExpertiseIds', JSON.stringify(payload.cleanerExpertiseIds));
    formData.append('dayOffs', JSON.stringify(payload.dayOffs));
    formData.append('joinedDate', payload.joinedDate.toISOString());

    return api.post(
      id && id !== 'new'
        ? API_ENDPOINT.UPDATE_CLEANER.replace('{id}', id)
        : API_ENDPOINT.CRAETE_CLEANER,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_CLEANERS, id],
    mutationFn: apiFn,
    onSuccess: () => {
      toast.success('Created successfully');
      navigate(-1);
    }
  });
}
