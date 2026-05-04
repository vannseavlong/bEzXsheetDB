import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';

type Props = {
  data: TopupAttributes[];
  pagination: PaginationProps;
};

export default function useTopUpQuery({
  type,
  currentPage,
  dateRange,
  searchText
}: {
  type: 'TOPUP' | 'PURCHASE';
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
}) {
  const queryFn = (): Promise<Props> => {
    return api.get(API_ENDPOINT.TOPUP, {
      params: {
        type,
        page: currentPage + 1,
        limit: 20,
        searchText,
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString()
      }
    });
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.ORDER_DETAIL, type, currentPage, dateRange, searchText],
    queryFn
  });

  return query;
}
