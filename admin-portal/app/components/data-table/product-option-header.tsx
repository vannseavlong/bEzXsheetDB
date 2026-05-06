import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

type Props = {
  table: Table<ProductOptionAttributes>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
};

export default function ProductOptionHeader({ table, setStatusFilter, statusFilter }: Props) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for service..."
        value={(table.getColumn('nameEn')?.getFilterValue() as string) ?? ''}
        onChange={(val) => table.getColumn('nameEn')?.setFilterValue(val)}
      />
      <div className="flex flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Deactivated">Deactivated</SelectItem>
          </SelectContent>
        </Select>
        <NavLink to="/product-option/new">
          <Button size="sm" className="bg-primary">
            {t('productPage.newProduct')} <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
