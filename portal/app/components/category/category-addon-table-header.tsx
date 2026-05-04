import type { Table } from '@tanstack/react-table';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router';

type Props = {
  table: Table<ProductAddOnGroupListAttributes>;
};

export default function CategoryAddonTableHeader({ table }: Props) {
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for group add-ons..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('nameEn')?.setFilterValue(val)}
      />
      <NavLink to="/category-addon/new">
        <Button size="sm">
          New Group Add-On
          <Plus />
        </Button>
      </NavLink>
    </div>
  );
}
