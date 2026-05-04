import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormItem } from '@/components/ui/form';
import type { Control, Path } from 'react-hook-form';
import type { CategoryInputProps } from '@/lib/schema/category-schema';

type Props = {
  control: Control<CategoryInputProps>;
  name: Path<CategoryInputProps>;
  index: number;
  fieldId: string;
  onDelete: (index: number) => void;
  onClick: (index: number) => void;
};

export default function TaskInformationItem({
  control,
  index,
  name,
  onDelete,
  fieldId,
  onClick
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fieldId
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const fieldPath = `${name}.${index}.value.en.title`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between px-1 group rounded-md hover:bg-muted/50"
    >
      <div className="flex items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 h-9 w-9"
          {...attributes}
          {...listeners}
        >
          <Grip className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex px-4">
        <FormField
          control={control}
          name={fieldPath as Path<CategoryInputProps>}
          render={({ field }) => (
            <FormItem className="w-full">
              <Input
                readOnly
                className="cursor-pointer flex flex-1"
                value={field.value as string}
                onClick={() => onClick(index)}
              />
            </FormItem>
          )}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(index)} // The delete function now uses the index
        className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity h-9 w-9"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}
