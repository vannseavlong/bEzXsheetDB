import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ReadOnlyFieldProps = {
  id: string;
  label: string;
  value: string | number;
};

export default function ReadOnlyField({ id, label, value }: ReadOnlyFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} readOnly />
    </div>
  );
}
