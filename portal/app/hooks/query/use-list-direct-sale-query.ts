import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CONSTANTS } from '@/constants/constants';
import { formatDatePayload } from '@/lib/date-helper';

type Props = {
  data: OrderListAttributes[];
  pagination: PaginationProps;
};

export default function useListDirectSaleQuery({
  currentPage,
  statusFilter,
  dateRange,
  searchText,
  paymentStatusFilter
}: {
  currentPage: number;
  statusFilter: string;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
  paymentStatusFilter?: string;
}) {
  const apiFn = (): Promise<Props> => {
    let params: { [key: string]: string | number | boolean } = {
      page: currentPage + 1,
      limit: CONSTANTS.LIMIT_PER_PAGE
    };

    if (statusFilter !== 'all') {
      params = {
        ...params,
        status: statusFilter
      };
    }
    if (dateRange?.from && dateRange?.to) {
      params = {
        ...params,
        startDate: formatDatePayload(dateRange.from),
        endDate: formatDatePayload(dateRange.to)
      };
    }

    if (paymentStatusFilter !== 'all') {
      params = {
        ...params,
        paymentStatus: paymentStatusFilter || ''
      };
    }

    if (searchText) {
      params = {
        ...params,
        searchText
      };
    }
    return api.get(API_ENDPOINT.LIST_DIRECT_SALE, {
      params
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.LIST_DIRECT_SALE,
      currentPage,
      statusFilter,
      dateRange,
      searchText,
      paymentStatusFilter
    ],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
}
