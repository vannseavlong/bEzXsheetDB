import type { Dispatch, SetStateAction } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';
import SortableProductOptionRow, {
  type ProductOptionRowProps
} from './sortable-product-option-row';

type Props = {
  title: string;
  buttonText?: string;
  options: { label: string; value: string }[];
  data: ProductOptionRowProps[];
  onChange: Dispatch<SetStateAction<ProductOptionRowProps[]>>;
};

export default function ProductOptionDraggablePanel({
  title,
  buttonText,
  options,
  data,
  onChange
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onChange((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateValue = (id: string, value: string) => {
    onChange((prev) => prev.map((item) => (item.id === id ? { ...item, value } : item)));
  };

  const handleUpdateAmount = (id: string, amount: string) => {
    onChange((prev) => prev.map((item) => (item.id === id ? { ...item, amount } : item)));
  };

  const handleDelete = (id: string) => {
    onChange((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAdd = () => {
    onChange((prev) => [
      ...prev,
      { id: Date.now().toString(), data: options, value: '', amount: '', isNew: true }
    ]);
  };

  return (
    <Card className="p-6 flex flex-col gap-0 w-full">
      <CardHeader className="p-0 pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={clsx({ 'border-b pb-4': data.length > 0 })}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {data.map((item) => (
                  <SortableProductOptionRow
                    key={item.id}
                    item={item}
                    onUpdateValue={(value) => handleUpdateValue(item.id, value)}
                    onUpdateAmount={(amount) => handleUpdateAmount(item.id, amount)}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
      <div>
        <Button type="button" className="pl-0!" variant="link" onClick={handleAdd}>
          <Plus />
          {buttonText ?? 'Add Another'}
        </Button>
      </div>
    </Card>
  );
}
