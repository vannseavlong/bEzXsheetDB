import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { formatDate } from '@/lib/date-helper';
import { useMutation } from '@tanstack/react-query';
import { useRef } from 'react';

export function useExportExcelMutation() {
  const name = useRef<string>('');
  const apiFn = ({
    type = 'finance',
    startDate,
    endDate,
    userStatus
  }: {
    type?:
      | 'finance'
      | 'topup'
      | 'bcombo'
      | 'direct-sale'
      | 'payment-link'
      | 'all-user'
      | 'coupon'
      | 'dashboard';
    startDate: string;
    endDate: string;
    userStatus?: string;
  }): Promise<Blob> => {
    name.current = `${type + (startDate && endDate && ' ' + formatDate(startDate) + ' - ' + formatDate(endDate))}`;
    return api.get(`${API_ENDPOINT.EXPORT_EXCEL}/${type}`, {
      params: {
        startDate,
        endDate,
        userStatus
      },
      responseType: 'blob'
    });
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.EXPORT_EXCEL],
    mutationFn: apiFn,
    onSuccess: (res) => {
      const blob = new Blob([res], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name.current}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    }
  });
}
