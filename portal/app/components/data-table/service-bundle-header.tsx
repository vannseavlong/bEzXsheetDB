import type { Table } from '@tanstack/react-table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';

// Define the ServiceBundleProps type to match your actual data
interface ServiceBundleProps {
  id: string;
  name: string;
  status: 'Active' | 'In Active';
  bundleType: string;
  date: Date;
}

type Props = {
  table: Table<ServiceBundleProps>;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
};

export default function ServiceBundleHeader({ table, setStatusFilter, statusFilter }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center p-4 justify-between">
      <SearchBar
        placeholder="Search for service..."
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="In Active">In Active</SelectItem>
          </SelectContent>
        </Select>
        <NavLink to="/service-bundle/new">
          <Button size="sm">
            {t('serviceBundlePage.newServiceBundle')} <Plus />
          </Button>
        </NavLink>
      </div>
    </div>
  );
}
