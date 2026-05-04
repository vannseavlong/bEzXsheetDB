import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import { useUpdateCustomerServiceMutation } from '@/hooks/mutations/use-update-customer-service-mutation';
import { useEffect, useState } from 'react';

export default function PreferredService({
  customerServices,
  id
}: {
  customerServices: CustomerServicesAttributes;
  id: string;
}) {
  const { data, isPending } = useCategoryNamesQuery();
  const [selected, setSelected] = useState<string>('none');
  const { mutateAsync } = useUpdateCustomerServiceMutation(id);

  useEffect(() => {
    if (customerServices?.categoryId) {
      setSelected(`${customerServices.categoryId}`);
    }
  }, [customerServices?.categoryId, data]);

  if (isPending) return <div>loading...</div>;

  return (
    <Select
      value={selected}
      onValueChange={async (value) => {
        setSelected(value);
        await mutateAsync({ categoryId: value });
      }}
    >
      <SelectTrigger className="w-[230px] border-none shadow-none">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="text-muted-foreground" value="none">
          None
        </SelectItem>
        {data?.map((item) => (
          <SelectItem key={`${item.id}`} value={`${item.id}`}>
            {item.nameEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
