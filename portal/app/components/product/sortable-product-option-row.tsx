import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus } from 'lucide-react';
import { Combobox } from '@/components/common/combobox';
import { Input } from '@/components/ui/input';

export type ProductOptionRowProps = DraggableComboBoxProps & { amount: string };

type Props = {
  item: ProductOptionRowProps;
  onUpdateValue: (value: string) => void;
  onUpdateAmount: (amount: string) => void;
  onDelete: (id: string) => void;
};

export default function SortableProductOptionRow({
  item,
  onUpdateValue,
  onUpdateAmount,
  onDelete
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id
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
      className="flex items-center gap-2 px-1 group hover:bg-gray-50"
    >
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 shrink-0"
        {...attributes}
        {...listeners}
      >
        <Grip className="h-4 w-4" />
      </button>

      <div className="flex-1">
        <Combobox
          placeholder="Select option"
          data={item.data}
          value={item.value}
          onSelect={onUpdateValue}
        />
      </div>

      <Input
        className="w-28 shrink-0"
        placeholder="Amount"
        value={item.amount}
        onChange={(e) => onUpdateAmount(e.target.value)}
      />

      <button
        type="button"
        onClick={() => onDelete(item.id)}
        className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}
