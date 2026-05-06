import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from 'react-i18next';

type Props = {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
  onToggleExpand: (id: string) => void;
};

export default function SortableTaskItem({ task, onUpdate, onDelete, onToggleExpand }: Props) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const [editingTitle, setEditingTitle] = useState(task.title);
  const [editingDescription, setEditingDescription] = useState(task.description);

  const handleSave = () => {
    onUpdate(task.id, {
      title: editingTitle,
      description: editingDescription,
      isExpanded: false,
      isNew: false
    });
  };

  const handleCancel = () => {
    if (task.isNew) {
      onDelete(task.id);
    } else {
      setEditingTitle(task.title);
      setEditingDescription(task.description);
      onToggleExpand(task.id);
    }
  };

  if (!task.isExpanded) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center justify-between py-3 px-1 group hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <button
            className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
            {...attributes}
            {...listeners}
          >
            <Grip className="h-4 w-4" />
          </button>
          <button
            onClick={() => onToggleExpand(task.id)}
            className="text-gray-900 hover:text-blue-600 font-medium"
          >
            {task.title}
          </button>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={setNodeRef} className="border rounded-sm px-3 pb-3">
      <div className="border-b">
        <Input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          className="font-medium border-none shadow-none focus-visible:ring-0"
          placeholder="Task Title"
        />
      </div>

      <Textarea
        value={editingDescription}
        onChange={(e) => setEditingDescription(e.target.value)}
        placeholder="Enter Description"
        rows={3}
        className="resize-none border-none shadow-none focus-visible:ring-0"
      />
      <div className="flex justify-end gap-4">
        <Button variant="destructive" onClick={handleCancel} size="sm">
          {t('cancel')}
        </Button>
        <Button onClick={handleSave} size="sm">
          {t('save')}
        </Button>
      </div>
    </div>
  );
}
