import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
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
import SortableComboBox from './sortable-combo-box';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';

type Props = {
  title: string;
  buttonText?: string;
  data: DraggableComboBoxProps[];
  onChange: Dispatch<SetStateAction<DraggableComboBoxProps[]>>;
  options?: { label: string; value: string }[];
  showAmount?: boolean;
};

export default function DraggableComboboxPanel({
  title,
  buttonText,
  data,
  onChange,
  options,
  showAmount
}: Props) {
  const { t } = useTranslation();

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

  const handleUpdateTask = (id: string, updates: Partial<DraggableComboBoxProps>) => {
    onChange((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (id: string) => {
    onChange((prev) => prev.filter((task) => task.id !== id));
  };

  const handleAddTask = () => {
    const newTask: DraggableComboBoxProps = {
      id: Date.now().toString(),
      data: options ?? [],
      value: '',
      amount: '',
      isNew: true
    };
    onChange((prev) => [...prev, newTask]);
  };

  return (
    <Card className="p-6 flex flex-col gap-0 w-full">
      <CardHeader className="p-0 pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className={clsx({
            'border-b pb-4': data.length > 0
          })}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={data.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {data.map((task) => (
                  <SortableComboBox
                    key={task.id}
                    task={task}
                    onUpdate={(value) => handleUpdateTask(task.id, { value })}
                    onDelete={handleDeleteTask}
                    showAmount={showAmount}
                    onAmountChange={(id, amount) => handleUpdateTask(id, { amount })}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
      <div>
        <Button type="button" className="pl-0!" variant="link" onClick={handleAddTask}>
          <Plus />
          {buttonText || t('addAnother')}
        </Button>
      </div>
    </Card>
  );
}
