import { CalendarRange } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DATE_RANGE_PRESETS, type DateRangePreset } from '@/lib/dashboard-date-ranges'

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangePreset)}>
      <SelectTrigger className="h-9 w-[160px] gap-2">
        <CalendarRange className="h-4 w-4 text-muted-foreground" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DATE_RANGE_PRESETS.map((preset) => (
          <SelectItem key={preset.value} value={preset.value}>
            {preset.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
