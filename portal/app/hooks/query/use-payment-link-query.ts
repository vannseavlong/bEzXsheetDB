import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: PaymentLinkAttributes[];
  pagination: PaginationProps;
};

export default function usePaymentLinkQuery({
  currentPage,
  dateRange,
  searchText
}: {
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
}) {
  const apiFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.PAYMENT_LINK, {
      params: {
        page: currentPage + 1,
        limit: 20,
        searchText,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.PAYMENT_LINK, currentPage, dateRange, searchText],
    queryFn: apiFn
  });

  return query;
}
