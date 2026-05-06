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
import { Card, CardContent } from '@/components/ui/card';
import clsx from 'clsx';
import SortableInput from './sortable-input';
import { useFieldArray, type Control, type FieldArrayPath, type Path } from 'react-hook-form';
import type { TaskInformationInputProps } from '@/lib/schema/category-schema';

type Props = {
  buttonText?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TaskInformationInputProps, any, any>;
  name: Path<TaskInformationInputProps>;
  label: string;
};

export default function DraggableInputBoxPanel({ buttonText, control, name, label }: Props) {
  const fieldName = `${name}.description` as FieldArrayPath<TaskInformationInputProps>;

  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: fieldName
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);
      move(oldIndex, newIndex); // Use the 'move' function from useFieldArray
    }
  };

  const handleAddTask = () => {
    append({ value: '' });
  };

  // return (
  //   <div>
  //     {fields.map((field, index) => (
  //       <div key={index}>{field.value}</div>
  //     ))}
  //   </div>
  // );

  return (
    <Card className="flex flex-col gap-0 shadow-none">
      <CardContent className="p-0">
        <div
          className={clsx({
            'pb-4': fields.length > 0
          })}
        >
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
                {fields.map((field, index) => (
                  <SortableInput
                    key={field.id} // RHF provides a stable key
                    control={control}
                    name={`${fieldName}.${index}.value` as Path<TaskInformationInputProps>}
                    index={index}
                    fieldId={field.id}
                    placeholder={label}
                    onRemove={() => remove(index)} // Pass the 'remove' function
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
