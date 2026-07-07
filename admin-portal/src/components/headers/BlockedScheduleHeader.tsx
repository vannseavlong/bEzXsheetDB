import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/shared/SearchBar'
import { usePermission } from '@/hooks/use-permission'
import { ACTIONS, MODULES } from '@/lib/permission-registry'

interface Props {
  search: string
  setSearch: (v: string) => void
}

export function BlockedScheduleHeader({ search, setSearch }: Props) {
  const { hasPermission } = usePermission()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <SearchBar
        placeholder="Search blocked schedules..."
        value={search}
        onChange={setSearch}
      />
      {hasPermission(MODULES.SETUP_SCHEDULE, ACTIONS.ADD) && (
        <Button size="sm" asChild>
          <NavLink to="/blocked-schedule/new">
            <Plus className="h-4 w-4 mr-1" />
            New Blocked Schedule
          </NavLink>
        </Button>
      )}
    </div>
  )
}
