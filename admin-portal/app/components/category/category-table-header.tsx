import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router';

type Props = {
  table: Table<CategoryAttributes>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
};

export default function CategoryTableHeader({ table, setStatusFilter, statusFilter }: Props) {
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for services..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('nameEn')?.setFilterValue(val)}
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
        <NavLink to="/category/new">
          <Button size="sm">
            New Category
            <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
