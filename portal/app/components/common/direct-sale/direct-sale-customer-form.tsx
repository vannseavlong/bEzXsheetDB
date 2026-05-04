import type { Control } from 'react-hook-form';
import { Combobox } from '../combobox';
import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useCustomerTypeDirectSaleQuery } from '@/hooks/query/use-customer-query';
import { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader
} from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useCreateDirectSaleCustomerMutation from '@/hooks/mutations/use-create-direct-sale-customer-mutation';

type Props = {
  control: Control<DirectSaleProps>;
};

export default function DirectSaleCustomerForm({ control }: Props) {
  const { data } = useCustomerTypeDirectSaleQuery();

  console.log({ data });
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>('');
  const preparedPayload = useMemo(() => {
    if (data) {
      return data.map((item) => ({
        label: `${item.firstName} (${item.username})`,
        value: `${item.id}`
      }));
    }
    return [];
  }, [data]);

  return (
    <>
      <FormField
        control={control}
        name="customerId"
        render={({ field }) => (
          <FormItem className="flex flex-1 flex-col">
            <div className="flex justify-between">
              <FormLabel>
                Customer Name<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel
                onClick={() => setOpen(true)}
                className="text-primary hover:underline cursor-pointer"
              >
                Add
              </FormLabel>
            </div>
            <Combobox
              placeholder="Select customer"
              data={preparedPayload}
              onAddNew={(val) => {
                setOpen(true);
                if (val) setText(val);
              }}
              className="w-full h-[40px]"
              value={`${field.value}`}
              onSelect={field.onChange}
            />
          </FormItem>
        )}
      />

      {/* <FormInput
        displayMessage={false}
        control={control}
        name="customerName"
        label="Customer Name"
        placeholder="Name"
      /> */}
      {/* <FormInput
        displayMessage={false}
        control={control}
        name="phonenumber"
        label="Phone Number"
        placeholder="Phone Number"
      /> */}
      <UserDirectSaleDialog text={text} open={open} onOpenChange={setOpen} />
    </>
  );
}

const UserDirectSaleDialog = ({
  text,
  open,
  onOpenChange
}: {
  text: string;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const { mutateAsync, isPending } = useCreateDirectSaleCustomerMutation();
  const handleCreateCustomer = async () => {
    await mutateAsync({
      name,
      phone
    });
    onOpenChange(false);
  };

  useEffect(() => {
    if (text) {
      setName(text);
    }
  }, [text]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle>Create Direct Sale User</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 pb-10">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="username-1">Phone Number</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button isLoading={isPending} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button isLoading={isPending} onClick={handleCreateCustomer} type="button">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
