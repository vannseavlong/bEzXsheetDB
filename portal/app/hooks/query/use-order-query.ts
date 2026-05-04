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

export default function useOrderQuery({
  currentPage,
  statusFilter,
  dateRange,
  searchText,
  paymentStatusFilter,
  type,
  isFinance
}: {
  currentPage: number;
  statusFilter: string | string[];
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
  type?: OrderTypeProps;
  paymentStatusFilter?: string;
  isFinance?: boolean;
}) {
  const apiFn = (): Promise<Props> => {
    let params: { [key: string]: string | number | boolean | string[] } = {
      page: currentPage + 1,
      limit: CONSTANTS.LIMIT_PER_PAGE
    };

    if (isFinance) {
      params = {
        ...params,
        isFinance: true
      };
    }
    if (type !== 'all') {
      params = {
        ...params,
        type: type as string
      };
    }
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

    if (paymentStatusFilter !== 'all' && type === 'DIRECT_SALE') {
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
    return api.get(API_ENDPOINT.ORDERS, {
      params
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.ORDERS,
      currentPage,
      statusFilter,
      dateRange,
      searchText,
      paymentStatusFilter,
      type
    ],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
}
