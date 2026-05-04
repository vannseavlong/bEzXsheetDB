import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export default function DeselectableRadioButton({
  id,
  value,
  checked,
  onToggle,
  label
}: {
  id: string;
  value: string;
  checked: boolean;
  onToggle: (value: string) => void;
  label: string;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={checked}
        onCheckedChange={() => onToggle(value)}
        className={cn(
          'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
        )}
      />
      {/* <button
        type="button"
        onClick={() => onToggle(value)}
        className={cn(
          'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center',
          'hover:border-primary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          checked && 'bg-blue-600 border-blue-600'
        )}>
        {checked && <div className="w-2 h-2 rounded-full bg-white" />}
      </button> */}
      <Label
        htmlFor={id}
        className="text-sm font-normal cursor-pointer"
        onClick={() => onToggle(value)}
      >
        {label}
      </Label>
    </div>
  );
}
