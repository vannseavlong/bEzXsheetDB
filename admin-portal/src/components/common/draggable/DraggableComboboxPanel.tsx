import type { Dispatch, SetStateAction } from 'react'
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
import SortableComboBox, { type ComboItem } from './SortableComboBox'

type Props = {
  title: string
  buttonText?: string
  data: ComboItem[]
  onChange: Dispatch<SetStateAction<ComboItem[]>>
  options?: { label: string; value: string }[]
  showAmount?: boolean
  showDuration?: boolean
}

export default function DraggableComboboxPanel({
  title, buttonText, data, onChange, options = [], showAmount, showDuration,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      onChange(items => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over?.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleUpdate = (id: string, value: string) =>
    onChange(prev => prev.map(i => i.id === id ? { ...i, value } : i))

  const handleAmountChange = (id: string, amount: string) =>
    onChange(prev => prev.map(i => i.id === id ? { ...i, amount } : i))

  const handleDurationChange = (id: string, duration: string) =>
    onChange(prev => prev.map(i => i.id === id ? { ...i, duration } : i))

  const handleDelete = (id: string) =>
    onChange(prev => prev.filter(i => i.id !== id))

  const handleAdd = () =>
    onChange(prev => [...prev, { id: Date.now().toString(), value: '', amount: '', duration: '' }])

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={data.map(i => i.id)} strategy={verticalListSortingStrategy}>
            <div className={data.length > 0 ? 'space-y-1 border-b pb-3 mb-1' : ''}>
              {data.map(item => {
                const selectedValues = new Set(data.filter(d => d.id !== item.id && d.value).map(d => d.value))
                return (
                  <SortableComboBox
                    key={item.id}
                    item={item}
                    options={options.filter(o => !selectedValues.has(o.value))}
                    onUpdate={v => handleUpdate(item.id, v)}
                    onDelete={() => handleDelete(item.id)}
                    showAmount={showAmount}
                    onAmountChange={a => handleAmountChange(item.id, a)}
                    showDuration={showDuration}
                    onDurationChange={d => handleDurationChange(item.id, d)}
                  />
                )
              })}
            </div>
          </SortableContext>
        </DndContext>
        <Button type="button" variant="link" className="pl-0! gap-1 mt-1" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          {buttonText ?? 'Add Another'}
        </Button>
      </CardContent>
    </Card>
  )
}
