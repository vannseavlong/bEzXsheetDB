import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import type { ProductSchemaProps } from '@/lib/schema/product-schema';
import { buildProductFormData } from './use-create-product-mutation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export function useUpdateProductMutation() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.PRODUCT_UPDATE],
    mutationFn: (payload: ProductSchemaProps & { id: string | number }) => {
      console.log('[UPDATE product payload]', payload);
      const { id, ...rest } = payload;
      const formData = buildProductFormData(rest);
      const url = API_ENDPOINT.PRODUCT_UPDATE.replace('{id}', id.toString());
      return api.put(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      toast.success('Product updated successfully');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_ENUM.PRODUCT_DETAIL] });
      navigate(-1);
    },
    onError: () => {}
  });
}
