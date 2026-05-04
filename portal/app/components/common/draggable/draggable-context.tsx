import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useEffect, useRef } from 'react';

type Props<T> = {
  children: React.ReactNode;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  onChange: (id: UniqueIdentifier, index: number) => void;
};
export default function DraggableContext<T extends { id: string | number }>({
  children,
  setData,
  data,
  onChange
}: Props<T>) {
  const draggedItemIdRef = useRef<UniqueIdentifier | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    draggedItemIdRef.current = active.id;
    if (active.id !== over?.id) {
      setData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // This useEffect hook is the core of the fix.
  // It will run whenever the `data` prop (the list) changes.
  useEffect(() => {
    // We only want to call onChange if an item was recently dragged.
    if (draggedItemIdRef.current) {
      const draggedItemId = draggedItemIdRef.current;
      // Find the new index of the dragged item in the updated list.
      const newIndex = data.findIndex((item) => item.id === draggedItemId);

      // Now we can safely call the side effect, which will only happen once
      // after the state has been updated.
      if (newIndex !== -1) {
        onChange(draggedItemId, newIndex);
      }

      // Reset the ref to prevent the effect from firing on other state changes.
      draggedItemIdRef.current = null;
    }
  }, [data, onChange]); // Depend on data and onChange

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {children}
    </DndContext>
  );
}
