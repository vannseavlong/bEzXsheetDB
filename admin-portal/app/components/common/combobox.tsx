import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import clsx from 'clsx';

type Props = {
  data: { label: string; value: string }[];
  placeholder?: string;
  notFoundText?: string;
  onAddNew?: (val?: string) => void;
  value: string;
  onSelect: (value: string) => void;
  className?: string;
  searchable?: boolean;
  disabled?: boolean;
};

export function Combobox({
  searchable = true,
  data,
  placeholder,
  onAddNew,
  onSelect,
  value,
  className,
  notFoundText = 'Not found',
  disabled
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx('justify-between h-9 overflow-hidden', className)}
        >
          <div className="truncate">
            {value ? data.find((framework) => framework.value === value)?.label : placeholder}
          </div>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="start" className={clsx('flex flex-1 p-0')}>
        <Command className="w-full">
          {searchable && (
            <CommandInput
              placeholder={placeholder}
              className="h-9"
              value={inputValue} // <-- controlled input
              onValueChange={(val) => setInputValue(val)}
            />
          )}
          <CommandList>
            <CommandEmpty className="p-0">
              <div className="p-4">{notFoundText}</div>
              {onAddNew && (
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    onAddNew(inputValue);
                    setOpen(false);
                    setInputValue('');
                  }}
                >
                  <Plus />
                  Add new
                </Button>
              )}
            </CommandEmpty>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.label}
                  onSelect={(labelAsCurrentValue) => {
                    const selectedItem = data.find((item) => item.label === labelAsCurrentValue);
                    console.log('asdsadsa', labelAsCurrentValue, selectedItem);
                    if (selectedItem) {
                      onSelect(selectedItem.value); // Pass the original machine-readable value
                    }
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
