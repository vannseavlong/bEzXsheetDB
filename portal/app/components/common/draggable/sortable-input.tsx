import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  index: number;
  placeholder: string;
  onRemove: () => void;
  fieldId: string;
};

export default function SortableInput<T extends FieldValues>({
  control,
  name,
  placeholder,
  onRemove,
  fieldId
}: Props<T>) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: fieldId
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div
              ref={setNodeRef}
              style={style}
              className="flex items-center justify-between px-1 group hover:bg-gray-50"
            >
              <div className="flex items-center">
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  {...attributes}
                  {...listeners}
                >
                  <Grip className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 flex px-4">
                <Input placeholder={placeholder} {...field} />
              </div>

              <button
                type="button"
                onClick={onRemove}
                className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
