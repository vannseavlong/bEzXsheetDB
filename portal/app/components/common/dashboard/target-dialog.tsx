import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSaleTargetMutation } from '@/hooks/mutations/use-sale-target-mutation';
import { useEffect, useState } from 'react';

type Props = {
  value?: string;
  onSave: (target: string) => void;
};

export default function TargetDialog({ value, onSave }: Props) {
  const { mutate, isPending, data } = useSaleTargetMutation();
  const [target, setTarget] = useState(value || '');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTarget(value || '');
  }, [value]);

  useEffect(() => {
    if (data) {
      onSave(data.saleTarget);
    }
  }, [data, onSave]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer text-primary text-sm font-semibold">Edit</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-[400px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Edit Target</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Target</Label>
            <Input
              type="number"
              onChange={(e) => setTarget(e.target.value)}
              value={target}
              name="target"
              placeholder="Enter target"
            />
          </div>
        </div>
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button isLoading={isPending} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            isLoading={isPending}
            onClick={() =>
              mutate(target, {
                onSuccess: () => {
                  setOpen(false);
                }
              })
            }
            type="button"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
