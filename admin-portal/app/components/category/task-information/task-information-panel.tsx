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
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import clsx from 'clsx';
import TaskInformationItem from './task-information-item';
import {
  type Control,
  type FieldArrayWithId,
  type Path,
  type UseFieldArrayMove,
  type UseFieldArrayRemove
} from 'react-hook-form';
import type { CategoryInputProps } from '@/lib/schema/category-schema';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type Props = {
  title: string;
  control: Control<CategoryInputProps>;
  name: Path<CategoryInputProps>;
  buttonText?: string;
  onClick: (index?: number) => void;
  fieldArray: {
    move: UseFieldArrayMove;
    remove: UseFieldArrayRemove;
    fields: FieldArrayWithId<CategoryInputProps, 'taskInformation', 'id'>[];
  };
};
export default function TaskInformationPanel({
  title,
  buttonText,
  onClick,
  control,
  name,
  fieldArray
}: Props) {
  const { move, remove, fields } = fieldArray;
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // const handleAddTask = () => {
  //   append({
  //     id: Date.now().toString(),
  //     value: {
  //       en: { title: '', description: [] },
  //       km: { title: '', description: [] },
  //       vi: { title: '', description: [] },
  //       tw: { title: '', description: [] },
  //       cn: { title: '', description: [] }
  //     }
  //   });
  //   onClick();
  // };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over?.id);
      move(oldIndex, newIndex);
    }
  };
  // const handleUpdateTask = (id: string, updates: Partial<DraggableInputProps>) => {
  //   onChange((prev) => prev.map((task) => (task.id === id ? { ...task, ...updates } : task)));
  // };

  // The remove function deletes an item from the field array at a specific index
  const handleDeleteTask = (index: number) => {
    remove(index);
  };

  return (
    <FormField
      control={control}
      name={name}
      render={() => (
        <FormItem className="w-full">
          <FormControl>
            <div className="w-full">
              <Card className="flex flex-col gap-0 shadow-none p-0">
                <CardContent className="p-0">
                  <CardHeader className="p-6">
                    <CardTitle>{title}</CardTitle>
                  </CardHeader>
                  <div className={clsx('px-4')}>
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                    >
                      <SortableContext
                        items={fields.map((field) => field.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-4">
                          {fields.map((field, index) => {
                            // if (!field.value.en?.title) return null;
                            return (
                              <TaskInformationItem
                                key={field.id} // RHF's field.id is stable and perfect for keys
                                control={control}
                                name={name}
                                index={index}
                                fieldId={field.id}
                                onDelete={handleDeleteTask}
                                onClick={onClick}
                              />
                            );
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </CardContent>
                <div className="px-6 pb-6">
                  <Button type="button" className="pl-0!" variant="link" onClick={() => onClick()}>
                    <Plus />
                    {buttonText || t('addAnother')}
                  </Button>
                </div>
              </Card>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
