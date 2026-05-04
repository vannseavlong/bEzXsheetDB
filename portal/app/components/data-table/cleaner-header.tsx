import type { Table } from '@tanstack/react-table';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router';
import { usePermission } from '@/hooks/use-permission';
import { ACTIONS, MODULES } from '@/lib/permission';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  table: Table<CleanerAttributes>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
};

export default function CleanerHeader({ table, statusFilter, setStatusFilter }: Props) {
  const { hasPermission } = usePermission();
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search for cleaner..."
        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('name')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        {hasPermission(MODULES.CLEANER, ACTIONS.ADD) && (
          <NavLink to="/cleaner/new">
            <Button size="sm">
              New Cleaner <Plus />
            </Button>
          </NavLink>
        )}
      </div>
    </div>
  );
}
