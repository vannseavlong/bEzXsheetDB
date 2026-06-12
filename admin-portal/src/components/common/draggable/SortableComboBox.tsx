import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Grip, Minus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'

export type ComboItem = {
  id: string
  value: string
  amount?: string
}

type Props = {
  item: ComboItem
  options: { label: string; value: string }[]
  onUpdate: (value: string) => void
  onDelete: () => void
  showAmount?: boolean
  onAmountChange?: (amount: string) => void
}

export default function SortableComboBox({ item, options, onUpdate, onDelete, showAmount, onAmountChange }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}
      className="flex items-center gap-2 px-1 group rounded-md hover:bg-gray-50 py-1">
      <button type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 shrink-0"
        {...attributes} {...listeners}>
        <Grip className="h-4 w-4" />
      </button>
      <div className="flex-1">
        <Select value={item.value} onValueChange={onUpdate}>
          <SelectTrigger className="h-9">
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showAmount && (
        <Input
          className="w-28 h-9 shrink-0"
          placeholder="Amount"
          value={item.amount ?? ''}
          onChange={e => onAmountChange?.(e.target.value)}
        />
      )}
      <button type="button" onClick={onDelete}
        className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Minus className="h-4 w-4" />
      </button>
    </div>
  )
}
