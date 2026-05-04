import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { CONSTANTS } from '@/constants/constants';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useQuery } from '@tanstack/react-query';
import type { ColumnFiltersState } from '@tanstack/react-table';

type Props = {
  data: ActivityLogAttributes[];
  pagination: PaginationProps;
};

function useActivityLogQuery({
  columnFilters,
  currentPage,
  searchText
}: {
  columnFilters?: ColumnFiltersState;
  currentPage: number;
  searchText?: string;
}) {
  const apiFn = (): Promise<Props> => {
    let params = {
      page: currentPage + 1,
      limit: CONSTANTS.LIMIT_PER_PAGE,
      searchText
    };
    if (columnFilters) {
      columnFilters.forEach((filter) => {
        params = {
          ...params,
          [filter.id]: filter.value
        };
      });
    }
    return api.get(API_ENDPOINT.ACTIVITY_LOGS, {
      params
    });
  };

  return useQuery({
    queryKey: [
      QUERY_KEY_ENUM.ACTIVITY_LOGS,
      JSON.stringify(columnFilters),
      currentPage,
      searchText
    ],
    queryFn: apiFn
  });
}

export { useActivityLogQuery };
