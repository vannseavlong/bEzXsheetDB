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
import SortableTaskItem from './sortable-task-item';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormField, FormItem } from '@/components/ui/form';

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name?: Path<T>;
  title: string;
  data: Task[];
  onChange: Dispatch<SetStateAction<Task[]>>;
};

export default function DraggableInputPanel<T extends FieldValues>({
  control,
  name,
  title,
  data,
  onChange
}: Props<T>) {
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

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    onChange((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  };

  const handleDeleteTask = (id: string) => {
    onChange((prev) => prev.filter((task) => task.id !== id));
  };

  const handleToggleExpand = (id: string) => {
    onChange((prev) =>
      prev.map((task) => (task.id === id ? { ...task, isExpanded: !task.isExpanded } : task))
    );
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: '',
      description: '',
      isExpanded: true,
      isNew: true
    };
    onChange((prev) => [...prev, newTask]);
  };

  return (
    <FormField
      control={control}
      name={name as Path<T>}
      render={() => (
        <FormItem>
          <Card className="flex flex-col max-w-[360px] p-6 gap-0">
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
                        <SortableTaskItem
                          key={task.id}
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={handleDeleteTask}
                          onToggleExpand={handleToggleExpand}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            </CardContent>
            <div>
              <Button className="!pl-0" variant="link" onClick={handleAddTask}>
                <Plus />
                {t('addContent')}
              </Button>
            </div>
          </Card>
        </FormItem>
      )}
    />
  );
}
