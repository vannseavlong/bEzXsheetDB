import SearchBar from '../common/search-bar';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { NavLink } from 'react-router';
import CustomSelect from '../common/custom-select';
import { usePermission } from '@/hooks/use-permission';
import { ACTIONS, MODULES } from '@/lib/permission';
import type { Table } from '@tanstack/react-table';

type Props = {
  search: string;
  setSearch: (value: string) => void;
  table: Table<CouponAttributes>;
};

export default function CouponHeader({ search, setSearch, table }: Props) {
  const { hasPermission } = usePermission();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4 justify-between">
      <div className="w-full sm:w-auto">
        <SearchBar placeholder="Search for Coupon..." value={search} onChange={setSearch} />
      </div>

      <div className="flex items-center gap-4 overflow-x-auto">
        <div className="w-50 shrink-0">
          <CustomSelect
            data={[
              { label: 'All', value: 'ALL' },
              { label: 'Select', value: 'SELECTED' }
            ]}
            placeholder="Select Target User"
            value={(table.getColumn('targetUser')?.getFilterValue() as string) ?? ''}
            onValueChange={(val) => table.getColumn('targetUser')?.setFilterValue(val)}
          />
        </div>

        <div className="shrink-0">
          {hasPermission(MODULES.MARKETING_COUPON, ACTIONS.ADD) && (
            <NavLink to="/coupon/new">
              <Button size="sm">
                New Coupon <Plus />
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
}
