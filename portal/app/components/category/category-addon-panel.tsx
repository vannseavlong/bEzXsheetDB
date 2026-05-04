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
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Grip, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox } from '@/components/common/combobox';
import useViewGroupAddonDetailQuery from '@/hooks/query/use-view-group-addon-detail-query';

export type AddonGroupState = {
  id: string;
  groupId: string;
  addOns: string[];
};

type GroupAddOnItem = {
  id: number;
  nameEn: string;
};

type ItemRowProps = {
  itemId: string;
  itemOptions: { label: string; value: string }[];
  onUpdateItem: (itemId: string) => void;
  onDeleteItem: () => void;
};

function ItemRow({ itemId, itemOptions, onUpdateItem, onDeleteItem }: ItemRowProps) {
  return (
    <div className="flex w-full items-center justify-between gap-3 px-1 pt-2">
      <div className="min-w-0 flex-1 pl-4">
        <Combobox
          placeholder="Select item"
          className="flex w-full min-w-0"
          data={itemOptions}
          value={itemId}
          onSelect={onUpdateItem}
        />
      </div>
      <button
        type="button"
        onClick={onDeleteItem}
        className="p-1 text-red-400 hover:text-red-600"
        aria-label="Remove add-on item"
      >
        <Minus className="h-4 w-4" />
      </button>
    </div>
  );
}

type GroupRowProps = {
  group: AddonGroupState;
  groupOptions: { label: string; value: string }[];
  onUpdateGroup: (groupId: string) => void;
  onDeleteGroup: () => void;
  onAddItem: () => void;
  onUpdateItem: (index: number, itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
};

function GroupRow({
  group,
  groupOptions,
  onUpdateGroup,
  onDeleteGroup,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}: GroupRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id
  });

  const { data: groupDetail } = useViewGroupAddonDetailQuery(group.groupId, {
    enabled: Boolean(group.groupId)
  });

  const availableAddOns: GroupAddOnItem[] = groupDetail?.addOns ?? [];
  const itemOptions = availableAddOns.map((item) => ({
    label: item.nameEn,
    value: item.id.toString()
  }));

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Group header — identical structure to SortableComboBox */}
      <div className="flex items-center justify-between px-1 group hover:bg-gray-50">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <Grip className="h-4 w-4" />
        </button>
        <div className="flex-1 flex px-4">
          <Combobox
            placeholder="Select group"
            className="flex flex-1"
            data={groupOptions}
            value={group.groupId}
            onSelect={onUpdateGroup}
          />
        </div>
        <button
          type="button"
          onClick={onDeleteGroup}
          className="p-1 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>

      {group.groupId && (
        <div className="pl-10 pb-2 space-y-2">
          {group.addOns.length > 0 ? (
            <div className="space-y-2">
              {group.addOns.map((itemId, index) => {
                const filteredOptions = itemOptions.filter(
                  (option) => option.value === itemId || !group.addOns.includes(option.value)
                );

                return (
                  <ItemRow
                    key={`${group.id}-${index}`}
                    itemId={itemId}
                    itemOptions={filteredOptions}
                    onUpdateItem={(nextItemId) => onUpdateItem(index, nextItemId)}
                    onDeleteItem={() => onRemoveItem(itemId)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No items selected</p>
          )}

          <Button
            type="button"
            variant="link"
            className="pl-0!"
            onClick={onAddItem}
            disabled={!availableAddOns.length}
          >
            {'+ Add Item'}
          </Button>
        </div>
      )}
    </div>
  );
}

type Props = {
  title: string;
  buttonText?: string;
  data: AddonGroupState[];
  onChange: Dispatch<SetStateAction<AddonGroupState[]>>;
  groupOptions: { label: string; value: string }[];
};

export default function CategoryAddonPanel({
  title,
  buttonText,
  data,
  onChange,
  groupOptions
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      onChange((groups) => {
        const oldIndex = groups.findIndex((g) => g.id === active.id);
        const newIndex = groups.findIndex((g) => g.id === over?.id);
        return arrayMove(groups, oldIndex, newIndex);
      });
    }
  };

  const handleUpdateGroup = (id: string, groupId: string) => {
    onChange((prev) => prev.map((g) => (g.id === id ? { ...g, groupId, addOns: [] } : g)));
  };

  const handleDeleteGroup = (id: string) => {
    onChange((prev) => prev.filter((g) => g.id !== id));
  };

  const handleAddItem = (id: string) => {
    onChange((prev) =>
      prev.map((group) => (group.id === id ? { ...group, addOns: [...group.addOns, ''] } : group))
    );
  };

  const handleUpdateItem = (id: string, index: number, itemId: string) => {
    onChange((prev) =>
      prev.map((group) => {
        if (group.id !== id) return group;
        const nextAddOns = [...group.addOns];
        nextAddOns[index] = itemId;
        return {
          ...group,
          addOns: nextAddOns
        };
      })
    );
  };

  const handleDeleteItem = (id: string, itemId: string) => {
    onChange((prev) =>
      prev.map((group) =>
        group.id === id
          ? { ...group, addOns: group.addOns.filter((value) => value !== itemId) }
          : group
      )
    );
  };

  const handleAddGroup = () => {
    onChange((prev) => [...prev, { id: Date.now().toString(), groupId: '', addOns: [] }]);
  };

  return (
    <Card className="p-6 flex flex-col gap-0 w-full">
      <CardHeader className="p-0 pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className={data.length > 0 ? 'border-b pb-4' : ''}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={data.map((g) => g.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {data.map((group) => (
                  <GroupRow
                    key={group.id}
                    group={group}
                    groupOptions={groupOptions}
                    onUpdateGroup={(gId) => handleUpdateGroup(group.id, gId)}
                    onDeleteGroup={() => handleDeleteGroup(group.id)}
                    onAddItem={() => handleAddItem(group.id)}
                    onUpdateItem={(index, itemId) => handleUpdateItem(group.id, index, itemId)}
                    onRemoveItem={(itemId) => handleDeleteItem(group.id, itemId)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
      <div>
        <Button type="button" className="pl-0!" variant="link" onClick={handleAddGroup}>
          <Plus />
          {buttonText || '+ Add Group'}
        </Button>
      </div>
    </Card>
  );
}
