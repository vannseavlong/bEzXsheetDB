import { ChevronDown } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

export interface MultiSelectOption {
  label: string
  value: string
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({ options, value, onChange, placeholder = 'Select…', className }: MultiSelectProps) {
  function toggle(optionValue: string) {
    onChange(
      value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue]
    )
  }

  const selectedLabels = options
    .filter(o => value.includes(o.value))
    .map(o => o.label)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          <span className={cn('line-clamp-1 text-left', selectedLabels.length === 0 && 'text-muted-foreground')}>
            {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-1" align="start">
        {options.map(option => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
          >
            <Checkbox
              checked={value.includes(option.value)}
              onCheckedChange={() => toggle(option.value)}
            />
            {option.label}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  )
}
