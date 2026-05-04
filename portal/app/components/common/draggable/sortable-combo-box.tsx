import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus } from 'lucide-react';
import { Combobox } from '../combobox';
import { Input } from '@/components/ui/input';

type Props = {
  task: DraggableComboBoxProps;
  onUpdate: (value: string) => void;
  onDelete: (id: string) => void;
  showAmount?: boolean;
  onAmountChange?: (id: string, amount: string) => void;
};

export default function SortableComboBox({
  task,
  onUpdate,
  onDelete,
  showAmount,
  onAmountChange
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
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
        <Combobox
          placeholder="Select"
          className="flex flex-1"
          key={task.id}
          data={task.data}
          value={task.value}
          onSelect={onUpdate}
        />
      </div>

      {showAmount && (
        <Input
          className="w-28 shrink-0 mr-2"
          placeholder="Amount"
          value={task.amount ?? ''}
          onChange={(e) => onAmountChange?.(task.id, e.target.value)}
        />
      )}

      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}
