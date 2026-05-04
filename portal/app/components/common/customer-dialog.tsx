import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useMemo, useState } from 'react';
import useCustomerQuery from '@/hooks/query/use-customer-query';

type Props = {
  onSelect: (value: CustomerAttributes) => void;
  children?: React.ReactNode;
  excludeUserIds?: string[];
};

export default function CustomerDialog({ onSelect, children, excludeUserIds }: Props) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data, isLoading } = useCustomerQuery({
    currentPage: 0,
    columnFilters: [],
    searchText,
    pageSize: 100,
    excludeUserIds
  });

  const customers = useMemo(() => {
    if (data?.data) {
      return data.data.map((item) => ({
        ...item,
        id: `${item.id}`
      }));
    }
    return [];
  }, [data]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="link">
            <Plus />
            Assign Another Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[600px] gap-6 p-8">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Customer List</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[500px] gap-6">
          <div className="grid gap-3">
            <Input
              value={searchText}
              placeholder="Search Name and phone number"
              onChange={(e) => setSearchText(e.target.value)}
              id="name"
              name="name"
              defaultValue="Pedro Duarte"
            />
          </div>
          <div className="overflow-y-auto space-y-4">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              customers.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-2 border-b px-4 cursor-pointer"
                  onClick={() => {
                    onSelect(item);
                    setOpen(false);
                  }}
                >
                  <div className="flex flex-1 items-center justify-between">
                    <span>
                      {item.firstName} {item.lastName}
                    </span>
                    <span>{item.username}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
