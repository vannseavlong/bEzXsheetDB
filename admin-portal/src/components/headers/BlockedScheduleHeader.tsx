import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function BlockedScheduleHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center p-4 sm:justify-between gap-4">
      <span className="text-sm text-muted-foreground">Manage blocked time slots</span>
      <Button size="sm" asChild>
        <NavLink to="/blocked-schedule/new">
          <Plus className="h-4 w-4 mr-1" />
          New Blocked Schedule
        </NavLink>
      </Button>
    </div>
  )
}
