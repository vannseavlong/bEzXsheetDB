import type { ColumnDef } from '@tanstack/react-table';
import TableCellDiv from './table-cell-div';
import { formatFullDate } from '@/lib/date-helper';
import { API_ENDPOINT } from '@/api/endpoint';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

function cleanPath(reqUrl: string) {
  const urlObj = new URL(reqUrl);
  const path = urlObj.pathname; // e.g., "/api/admin/announcement/list"

  // 1. Normalize the path
  // Remove /api/ and /admin/ prefixes and trim slashes
  const cleanPath = path
    .replace(/^\/(api|admin)\//gi, '/') // Removes /api/ or /admin/
    .replace(/^\/(api|admin)\//gi, '/') // Runs again to catch /api/admin/
    .replace(/^\/+|\/+$/g, '') // Trim leading/trailing slashes
    .toLowerCase();
  return cleanPath;
}

function getNormalizedPath(reqUrl: string) {
  const cleanedPath = cleanPath(reqUrl);

  // 2. Handle the {id} placeholder logic
  // Converts "announcement/55/resend" -> "announcement/{id}/resend"
  const normalizedPath = cleanedPath
    .replace(/\/\d+(?=\/|$)/g, '/{id}')
    .replace(/\/([a-f0-9-]{36})(?=\/|$)/g, '/{id}');
  return normalizedPath;
}

function getModuleFromFullUrl(reqUrl: string): string | 'UNKNOWN_ROUTE' {
  try {
    const normalizedPath = getNormalizedPath(reqUrl);
    // 3. Find the matching key
    const match = Object.entries(API_ENDPOINT).find(([, routeValue]) => {
      const cleanRouteValue = routeValue.replace(/^\/+|\/+$/g, '').toLowerCase();
      return cleanRouteValue === normalizedPath;
    });

    // Cast the result to our Type
    return match ? match[0] : 'UNKNOWN_ROUTE';
  } catch (error) {
    console.error('Mapping Error:', error);
    return 'UNKNOWN_ROUTE';
  }
}

export const activityLogColumns: ColumnDef<ActivityLogAttributes>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => (
      <TableCellDiv>
        {row.original.createdAt ? formatFullDate(row.original.createdAt) : '-'}
      </TableCellDiv>
    )
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => <TableCellDiv>{row.original.username}</TableCellDiv>
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <TableCellDiv>{row.original.role}</TableCellDiv>
  },
  {
    accessorKey: 'reqUrl',
    header: 'API Url',
    cell: ({ row }) => {
      return <TableCellDiv>{cleanPath(row.original.reqUrl)}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'reqMethod',
    header: 'Action',
    cell: ({ row }) => {
      const action = getModuleFromFullUrl(row.original.reqUrl);
      // console.log('action: ', action);
      return <TableCellDiv>{action}</TableCellDiv>;
    }
  },
  {
    accessorKey: 'reqBody',
    header: 'Data',
    cell: ({ row }) => {
      return (
        <TableCellDiv>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-[200px] truncate">{JSON.stringify(row.original.reqBody)}</div>
            </TooltipTrigger>
            <TooltipContent>
              <pre>{JSON.stringify(row.original.reqBody, null, 2)}</pre>
            </TooltipContent>
          </Tooltip>
        </TableCellDiv>
      );
    }
  }
];
