import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/common/custom-select';
import { Plus, Minus } from 'lucide-react';
import type { SelectedProductOptionProps } from '@/lib/schema/product-schema';

type ProductOptionPanelProps = {
  title: string;
  options: ProductOptionAttributes[];
  value: SelectedProductOptionProps[];
  onChange: (value: SelectedProductOptionProps[]) => void;
};

export default function ProductOptionPanel({
  title,
  options,
  value,
  onChange
}: ProductOptionPanelProps) {
  const selectOptions = options.map((o) => ({
    label: o.nameEn,
    value: String(o.id)
  }));

  const handleAdd = () => {
    onChange([...value, { id: 0, amount: '' }]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, id: string) => {
    const updated = value.map((item, i) => (i === index ? { ...item, id: Number(id) } : item));
    onChange(updated);
  };

  const handleAmountChange = (index: number, amount: string) => {
    const updated = value.map((item, i) => (i === index ? { ...item, amount } : item));
    onChange(updated);
  };

  return (
    <Card className="flex flex-col gap-0 shadow-none p-0">
      <CardContent className="p-0">
        <CardHeader className="p-6">
          <CardTitle>{title}</CardTitle>
        </CardHeader>

        {value.length > 0 && (
          <div className="px-6 space-y-3 pb-2">
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-1">
                  <CustomSelect
                    placeholder="Select option"
                    data={selectOptions}
                    value={item.id ? String(item.id) : ''}
                    onValueChange={(v) => handleOptionChange(index, v)}
                  />
                </div>
                <Input
                  className="w-28"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive shrink-0"
                  onClick={() => handleRemove(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <div className="px-6 pb-6">
        <Button type="button" className="pl-0!" variant="link" onClick={handleAdd}>
          <Plus />
          Add Another
        </Button>
      </div>
    </Card>
  );
}
