import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

export default function usePrintInvoiceMutation() {
  const apiFn = (bulkOrderId: string): Promise<string> => {
    return api.get(API_ENDPOINT.PRINT_VAT_INVOICE, {
      params: {
        bulkOrderId
      },
      responseType: 'text' // make sure it's raw HTML
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.CREATE_SERVICE_ITEMS],
    mutationFn: apiFn
  });
}
