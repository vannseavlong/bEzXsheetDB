import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { formatDatePayload } from '@/lib/date-helper';

type Props = {
  data: OrderListAttributes[];
  pagination: PaginationProps;
};

export default function useCalendarOrderQuery({
  statusFilter,
  dateRange,
  searchText,
  paymentStatusFilter,
  type
}: {
  statusFilter: string | string[];
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
  paymentStatusFilter?: string;
  type?: OrderTypeProps;
}) {
  const apiFn = (): Promise<Props> => {
    let params: { [key: string]: string | number | boolean | string[] } = {};

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
    return api.get(API_ENDPOINT.CALENDAR_ORDERS, {
      params
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.CALENDAR_ORDERS,
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
