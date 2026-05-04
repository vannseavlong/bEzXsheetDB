import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';

type Props = {
  data: CustomerAttributes[];
  pagination: PaginationProps;
};

export default function useCustomerQuery({
  currentPage,
  dateRange,
  searchText,
  pageSize = 15,
  columnFilters,
  enabled = true,
  excludeUserIds,
  isRegisteredCustomer
}: {
  currentPage: number;
  dateRange?: { from?: Date; to?: Date };
  searchText?: string;
  pageSize?: number;
  columnFilters: ColumnFiltersState;
  enabled?: boolean;
  excludeUserIds?: string[];
  isRegisteredCustomer?: boolean;
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
      searchText,
      excludeUserIds
      // startDate: dateRange?.from?.toISOString(),
      // endDate: dateRange?.to?.toISOString()
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

    return api.get(API_ENDPOINT.CUSTOMERS, {
      params: {
        ...params,
        isRegisteredCustomer
      }
    });
  };

  const query = useQuery({
    queryKey: [
      QUERY_KEY_ENUM.CUSTOMERS,
      currentPage,
      dateRange?.from,
      dateRange?.to,
      searchText,
      pageSize,
      columnFilters,
      excludeUserIds
    ],
    queryFn: apiFn,
    placeholderData: keepPreviousData,
    enabled
  });

  return query;
}

export const useCustomerTypeDirectSaleQuery = () => {
  const apiFn = (): Promise<DirectSaleUserProps[]> => {
    return api.get(API_ENDPOINT.CUSTOMER_TYPE_DIRECT_SALE);
  };

  const query = useQuery({
    queryKey: [QUERY_KEY_ENUM.CUSTOMER_TYPE_DIRECT_SALE],
    queryFn: apiFn,
    placeholderData: keepPreviousData
  });

  return query;
};
