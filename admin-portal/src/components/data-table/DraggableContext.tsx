import { useRef, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable'

interface DraggableContextProps<TData extends { id: string }> {
  children: React.ReactNode
  data: TData[]
  setData: React.Dispatch<React.SetStateAction<TData[]>>
  onChange: (id: string, newIndex: number) => void
}

export function DraggableContext<TData extends { id: string }>({
  children,
  data,
  setData,
  onChange,
}: DraggableContextProps<TData>) {
  const draggedIdRef = useRef<string | null>(null)
  const pendingChangeRef = useRef<{ id: string; newIndex: number } | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    if (pendingChangeRef.current) {
      const { id, newIndex } = pendingChangeRef.current
      pendingChangeRef.current = null
      onChange(id, newIndex)
    }
  }, [data, onChange])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = data.findIndex((item) => item.id === active.id)
    const newIndex = data.findIndex((item) => item.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    draggedIdRef.current = String(active.id)
    pendingChangeRef.current = { id: String(active.id), newIndex }

    setData((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  )
}
