import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Grip, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TaskData } from './TaskInformationDialog'

type Props = {
  id: string
  data: TaskData
  index: number
  onDelete: (index: number) => void
  onClick: (index: number) => void
}

export default function TaskInformationItem({ id, data, index, onDelete, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-1 group rounded-md hover:bg-muted/50"
    >
      <Button type="button" variant="ghost" size="icon"
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 h-9 w-9 shrink-0"
        {...attributes} {...listeners}>
        <Grip className="h-4 w-4" />
      </Button>
      <div className="flex-1 px-3">
        <Input
          readOnly
          className="cursor-pointer"
          value={data.en.title}
          onClick={() => onClick(index)}
        />
      </div>
      <Button type="button" variant="ghost" size="icon"
        onClick={() => onDelete(index)}
        className="h-9 w-9 shrink-0 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  )
}
