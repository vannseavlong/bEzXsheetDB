import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';

type Props<T extends object> = {
  placeholder: string;
  data: T[];
  value: string[];
  onValueChange: (value: string[]) => void;
  labelKey: keyof T;
  valueKey: keyof T;
  className?: string;
  isLoading: boolean;
  searchable?: boolean;
};

export default function MultipleSelectSearch<T extends object>({
  data,
  placeholder,
  value,
  onValueChange,
  labelKey,
  valueKey,
  className,
  isLoading,
  searchable = false
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  value = value.map((item) => `${item}`);

  // Type-safe filtering
  const filteredOptions = data.filter((item) => {
    const label = item[labelKey];
    return typeof label === 'string'
      ? label.toLowerCase().includes(searchValue.toLowerCase())
      : false;
  });

  const handleSelect = (val: string) => {
    if (value.includes(val)) {
      onValueChange(value.filter((v) => v !== val));
    } else {
      onValueChange([...value, val]);
    }
  };

  // const handleRemove = (val: string) => {
  //   onValueChange(value.filter((v) => v !== val));
  // };

  const selectedLabels = value
    .map((val) => data.find((item) => String(item[valueKey]) === val))
    .filter((item): item is T => Boolean(item))
    .map((item) => String(item[labelKey]));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          isLoading={isLoading}
          aria-expanded={open}
          className={clsx(
            'w-full justify-between h-10 bg-transparent hover:bg-transparent px-0',
            className
          )}
        >
          <div className="flex gap-2 flex-1 overflow-x-auto no-scrollbar">
            {value.length === 0 ? (
              <span className="text-muted-foreground whitespace-nowrap">{placeholder}</span>
            ) : (
              <div className="text-xs whitespace-nowrap flex-shrink-0 text-black">
                {selectedLabels.join(', ')}
              </div>
            )}
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0" align="start">
        {searchable && (
          <div className="p-2">
            <Input
              placeholder="Search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="h-9"
            />
          </div>
        )}

        <div className="max-h-60 overflow-auto w-[200px]">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">No items found.</div>
          ) : (
            filteredOptions.map((item) => {
              const itemValue = String(item[valueKey]);
              const itemLabel = String(item[labelKey]);

              return (
                <div
                  key={itemValue}
                  className={cn(
                    'flex items-center px-2 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground',
                    value.includes(itemValue) && 'bg-accent'
                  )}
                  onClick={() => handleSelect(itemValue)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value.includes(itemValue) ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {itemLabel}
                </div>
              );
            })
          )}
        </div>

        {/* {value.length > 0 && (
          <div className="border-t p-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-destructive"
              onClick={() => onValueChange([])}>
              Clear all ({value.length})
            </Button>
          </div>
        )} */}
      </PopoverContent>
    </Popover>
  );
}
