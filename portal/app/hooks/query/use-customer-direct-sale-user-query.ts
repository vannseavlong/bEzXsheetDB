import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';

type Props = {
  data: CustomerAttributes[];
  pagination: PaginationProps;
};

export function useCustomerDirectSaleUserQuery({
  currentPage,
  searchText,
  pageSize = 15,
  dateRange,
  columnFilters
}: {
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
  pageSize?: number;
  columnFilters: ColumnFiltersState;
}) {
  const apiFn = (): Promise<Props> => {
    let params: {
      page: number;
      limit: number;
      searchText?: string;
      startDate?: string;
      endDate?: string;
      excludeUserIds?: string[];
    } = {
      page: currentPage + 1,
      limit: pageSize,
      searchText
    };

    if (dateRange?.from) {
      params = {
        ...params,
        startDate: dateRange?.from?.toISOString()
      };
    }
    if (dateRange?.to) {
      params = {
        ...params,
        endDate: dateRange?.to?.toISOString()
      };
    }
    columnFilters.forEach((filter) => {
      params = {
        ...params,
        [filter.id]: filter.value
      };
    });

    return api.get(API_ENDPOINT.CUSTOMER_DIRECT_SALE_USERS, {
      params
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.CUSTOMER_DIRECT_SALE_USERS,
      searchText,
      pageSize,
      dateRange,
      columnFilters
    ],
    queryFn: apiFn
  });

  return query;
}
