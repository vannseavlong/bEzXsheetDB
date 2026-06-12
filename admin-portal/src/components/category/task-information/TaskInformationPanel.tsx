import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import TaskInformationItem from './TaskInformationItem'
import type { TaskData } from './TaskInformationDialog'

export type TaskItem = { id: string } & TaskData

type Props = {
  items: TaskItem[]
  onChange: (items: TaskItem[]) => void
  onAdd: () => void
  onEdit: (index: number) => void
}

export default function TaskInformationPanel({ items, onChange, onAdd, onEdit }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex(i => i.id === active.id)
      const newIndex = items.findIndex(i => i.id === over?.id)
      onChange(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Task Information</CardTitle>
      </CardHeader>
      <CardContent className="pb-4 space-y-1">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {items.map((item, index) => (
                <TaskInformationItem
                  key={item.id}
                  id={item.id}
                  data={item}
                  index={index}
                  onDelete={idx => onChange(items.filter((_, i) => i !== idx))}
                  onClick={onEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <Button type="button" variant="link" className="pl-0! gap-1" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Another
        </Button>
      </CardContent>
    </Card>
  )
}
