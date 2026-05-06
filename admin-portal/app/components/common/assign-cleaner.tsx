import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { CalendarX2, Check, Flag, Plus, X as Cancel01Icon } from 'lucide-react';
import SearchBar from './search-bar';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { getAvatarFallbackText } from '@/lib/utils';
import { useCleanersQuery } from '@/hooks/query/use-cleaners-query';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import moment from 'moment';

export interface AssignCleanerHandle {
  resetCleaner: () => void;
}

interface AssignCleanerProps {
  scheduleStartDate: string;
  orderCleaners?: CleanerAttributes[];
  onChange: (cleaner: CleanerAttributes) => void;
}

const AssignCleaner = forwardRef<AssignCleanerHandle, AssignCleanerProps>(
  ({ scheduleStartDate, orderCleaners, onChange }, ref) => {
    const { data, isPending } = useCleanersQuery(1);
    const [cleaners, setCleaners] = useState<CleanerAttributes[]>([]);
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false); // 👈 control popover state

    const cleaner = useMemo(() => {
      if (!data || data.length === 0) return [];
      return data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }, [search, data]);

    useEffect(() => {
      if (!orderCleaners) return;
      setCleaners([...orderCleaners]);
    }, [orderCleaners]);

    useImperativeHandle(
      ref, // first: the ref from parent
      () => ({
        // second: object with methods to expose
        resetCleaner: () => {
          setCleaners(orderCleaners || []);
        }
      }),
      [orderCleaners] // third: dependencies
    );

    return (
      <div className="flex gap-3 overflow-x-scroll">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-primary bg-[#E8F0F7] rounded-full size-10">
              <Plus />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-90 max-h-[400px] p-0 overflow-hidden">
            <div className="flex flex-col h-[400px]">
              <div className="gap-y-2 flex justify-between p-4">
                <h4 className="leading-none font-medium">
                  Assign Cleaners {cleaners.length > 0 ? `(${cleaners.length})` : ''}
                </h4>
                <Button
                  variant="ghost"
                  className="text-destructive py-0 h-auto"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="px-4">
                <SearchBar placeholder="Find Cleaner" onChange={setSearch} value={search} />
              </div>
              <div
                className="flex-1 overflow-y-auto p-0"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
              >
                {isPending ? (
                  <div>loading..</div>
                ) : (
                  cleaner.map((item) => {
                    const isActive = cleaners.some((cleaner) => cleaner.id === item.id);
                    return (
                      <CleanerItem
                        onClick={() => {
                          if (isActive) {
                            setCleaners(cleaners.filter((cleaner) => cleaner.id !== item.id));
                          } else {
                            setCleaners([...cleaners, item]);
                          }
                          onChange(item);
                        }}
                        isActive={isActive}
                        isDayOff={
                          item.cleanerWeeklyOffs?.includes(moment(scheduleStartDate).day()) || false
                        }
                        key={item.id}
                        item={item}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        {cleaners.map((cleaner) => (
          <CleanerAvatar
            item={cleaner}
            key={cleaner.id}
            onRemove={() => {
              setCleaners(cleaners.filter((item) => item !== cleaner));
              onChange(cleaner);
            }}
          />
        ))}
      </div>
    );
  }
);

type ItemProps = {
  onRemove: () => void;
  item: CleanerAttributes;
};

const CleanerAvatar = ({ onRemove, item }: ItemProps) => {
  return (
    <div className="relative">
      <Avatar className="size-10">
        <AvatarImage src={item.image} />
        <AvatarFallback>{getAvatarFallbackText(item.name)}</AvatarFallback>
      </Avatar>
      <div
        className="absolute top-0 right-0 bg-white rounded-full p-[1px] shadow-2xs cursor-pointer"
        onClick={onRemove}
      >
        <Cancel01Icon className="size-3 text-red-500" />
      </div>
    </div>
  );
};

const CleanerItem = ({
  item,
  isActive,
  isDayOff,
  onClick
}: {
  item: CleanerAttributes;
  isActive: boolean;
  isDayOff: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex gap-4 items-center overflow-auto cursor-pointer p-4 border-b"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="size-10">
          <AvatarImage src={item?.image} />
          <AvatarFallback>{getAvatarFallbackText(item?.name)}</AvatarFallback>
        </Avatar>
        {isDayOff && (
          <Tooltip>
            <TooltipTrigger asChild>
              <CalendarX2
                size={20}
                className="text-red-500 absolute top-0 left-[-10px] bg-background rounded-full"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Day Off</p>
            </TooltipContent>
          </Tooltip>
        )}
        {item.role === 'LEADER' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Flag
                size={20}
                className="text-primary absolute top-0 right-[-10px] bg-background rounded-full"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Leader</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="flex flex-col flex-1 overflow-auto">
        <span>{item?.name}</span>
        <span className="text-xs">{item?.expertises?.join(', ')}</span>
      </div>
      {isActive && <Check className="size-4 text-primary" />}
    </div>
  );
};

AssignCleaner.displayName = 'AssignCleaner';
export default AssignCleaner;
