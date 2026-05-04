import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';

type Props = {
  data: CustomerAttributes[];
  pagination: PaginationProps;
};

export default function useRegisteredCustomerQuery({
  currentPage,
  dateRange,
  searchText,
  pageSize = 15,
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
        startDate: dateRange?.from.toISOString()
      };
    }
    if (dateRange?.to) {
      params = {
        ...params,
        endDate: dateRange?.to.toISOString()
      };
    }

    columnFilters.forEach((filter) => {
      params = {
        ...params,
        [filter.id]: filter.value
      };
    });

    return api.get(API_ENDPOINT.REGISTER_CUSTOMER, {
      params
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.REGISTER_CUSTOMERS,
      currentPage,
      dateRange?.from,
      dateRange?.to,
      searchText,
      pageSize,
      columnFilters
    ],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
}
