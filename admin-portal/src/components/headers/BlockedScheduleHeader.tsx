import { NavLink } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  onNew?: () => void
}

export function BlockedScheduleHeader({ onNew }: Props) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 border-b">
      <h1 className="text-xl font-bold">Blocked Schedule</h1>
      <Button size="sm" asChild>
        <NavLink to="/blocked-schedule/new">
          <Plus className="h-4 w-4 mr-1" />
          New Blocked Schedule
        </NavLink>
      </Button>
    </div>
  )
}
