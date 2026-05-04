import { type FieldValues, type Path, type UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';

type Props<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
};

export default function FormTextareaPopOver<T extends FieldValues>({
  name,
  label,
  placeholder,
  form
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [tempText, setTempText] = useState('');
  const { control } = form;

  return (
    <FormField
      control={control}
      name={`${name}.en` as Path<T>}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <div>
                  <Input
                    placeholder={placeholder}
                    value={field.value}
                    readOnly
                    className="cursor-pointer"
                    onClick={() => setOpen(true)}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="textarea" className="block text-sm font-medium mb-2">
                      Enter your text
                    </label>
                    <Textarea
                      id="textarea"
                      placeholder="Type your message here..."
                      className="min-h-[120px] resize-none"
                      autoFocus
                      value={tempText}
                      onChange={(e) => setTempText(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setOpen(false);
                        field.onChange(tempText);
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
