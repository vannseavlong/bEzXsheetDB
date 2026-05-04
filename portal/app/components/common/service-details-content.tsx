import useServiceItemsQuery from '@/hooks/query/use-service-item-query';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Delete01Icon, MessageAdd01Icon } from 'hugeicons-react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Textarea } from '../ui/textarea';
import clsx from 'clsx';
import { cn } from '@/lib/utils';

type Props = {
  selectedServices: { [id: string]: string[] };
  setSelectedServices: React.Dispatch<React.SetStateAction<{ [id: string]: string[] }>>;
  className?: string;
  title?: React.ReactNode;
};

export default function ServiceDetailsContent({
  selectedServices,
  setSelectedServices,
  className,
  title
}: Props) {
  const { data, isPending } = useServiceItemsQuery('1');
  return (
    <div className={cn('flex-1 relative overflow-y-auto p-6 pt-2', className)}>
      {title || <h4 className="mb-6">Service Details</h4>}
      {isPending ? (
        <div>loading</div>
      ) : (
        data?.map((item, index) => (
          <ServiceContent
            setSelectedItems={setSelectedServices}
            onClick={() => {
              console.log({ index, selectedServices });
              if (selectedServices[item.id]) {
                setSelectedServices((prev) => {
                  delete prev[item.id];
                  return { ...prev };
                });
              } else {
                setSelectedServices((prev) => {
                  prev[item.id] = [''];
                  return { ...prev };
                });
              }
            }}
            selectedItems={selectedServices}
            item={item}
            key={item.id}
          />
        ))
      )}
    </div>
  );
}

const ServiceContent = ({
  item,
  onClick,
  selectedItems,
  setSelectedItems
}: {
  item: ServiceItemAttributes;
  onClick: () => void;
  selectedItems: { [id: string]: string[] };
  setSelectedItems: React.Dispatch<React.SetStateAction<{ [id: string]: string[] }>>;
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3">
        <Checkbox id={item.id} checked={item.id in selectedItems} onCheckedChange={onClick} />
        <Label className="flex flex-1" htmlFor={item.id}>
          {item.name}
        </Label>
        <div className="flex items-end justify-end h-4">
          {item.id in selectedItems && (
            <div
              className="h-full pl-4 text-sm cursor-pointer text-primary font-semibold"
              onClick={() => {
                selectedItems[item.id].push('');
                setSelectedItems({ ...selectedItems });
              }}
            >
              Add More Service
            </div>
          )}
        </div>
      </div>

      <div className="relative space-y-4 my-4">
        {selectedItems[item.id]?.map((text, index) => (
          <div key={index} className="flex flex-1 w-full justify-center my-4">
            <div className="w-30">
              <span className="text-sm">
                {item.name} {index + 1}
              </span>
            </div>
            <div className="flex flex-1 border-b pb-4">
              <div>{item.description}</div>
            </div>
            <div className="flex items-start gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center cursor-pointer relative">
                    <MessageAdd01Icon className="size-5 text-primary ml-4" />
                    {text.length > 0 && (
                      <div className="absolute top-px right-px w-1.75 h-1.75 rounded-full bg-destructive" />
                    )}
                  </div>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end">
                  <Textarea
                    className="border-0 resize-none shadow-none"
                    value={text}
                    onChange={(e) => {
                      setSelectedItems((prev) => {
                        prev[item.id][index] = e.target.value;
                        return { ...prev };
                      });
                    }}
                  />
                </PopoverContent>
              </Popover>
              {/* this one not working? */}
              <Delete01Icon
                className={clsx('size-5 text-destructive cursor-pointer', {
                  hidden: index === 0 && selectedItems[item.id]?.length === 1
                })}
                onClick={() => {
                  selectedItems[item.id].splice(index, 1);
                  setSelectedItems({ ...selectedItems });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
