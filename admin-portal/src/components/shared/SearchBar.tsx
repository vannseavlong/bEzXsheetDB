import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

type Props = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export function SearchBar({ value, placeholder = 'Search...', onChange }: Props) {
  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
      <Input
        type="search"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9 h-9"
      />
    </div>
  )
}
