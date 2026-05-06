import { useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import useProductAddOnByCategoryQuery from '@/hooks/query/use-product-add-on-by-category-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Uploader } from '@/components/common/uploader';
import { Button } from '@/components/ui/button';
import useAddOrderAddOnMutation from '@/hooks/mutations/use-add-order-addon-mutation';

type ServiceAddOnDialogProps = {
  categoryId: string;
  orderId: string;
  paymentStatus: string;
};

type AddOnRow = {
  id: string;
  productAddOnId: string;
  qty: string;
};

const createRow = (): AddOnRow => ({
  id: `${Date.now()}-${Math.random()}`,
  productAddOnId: '',
  qty: '1'
});

const getAddOnLabel = (item: ProductAddOnAttributes) => {
  return item.nameEn || item.nameKm || item.nameVi || item.nameCn || item.nameTw || item.id;
};

export default function ServiceAddOnDialog({
  categoryId,
  orderId,
  paymentStatus
}: ServiceAddOnDialogProps) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<AddOnRow[]>([createRow()]);
  const [file, setFile] = useState<File | null>(null);
  const { mutateAsync, isPending } = useAddOrderAddOnMutation();

  const { data: addOns = [], isFetching } = useProductAddOnByCategoryQuery(categoryId, open);

  const isPaid = paymentStatus === 'PAID';
  const requiresAttachment = isPaid && !file;

  const canSave = useMemo(() => {
    const hasInvalidRow = rows.some(
      (row) => !row.productAddOnId || !row.qty || Number(row.qty) <= 0
    );
    return !hasInvalidRow && !requiresAttachment;
  }, [rows, requiresAttachment]);

  const resetState = () => {
    setRows([createRow()]);
    setFile(null);
  };

  const onOpenChange = (value: boolean) => {
    setOpen(value);
    if (!value) {
      resetState();
    }
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, createRow()]);
  };

  const handleRemoveRow = (id: string) => {
    setRows((prev) => (prev.length > 1 ? prev.filter((row) => row.id !== id) : prev));
  };

  const handleRowChange = (id: string, field: keyof Omit<AddOnRow, 'id'>, value: string) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleSave = async () => {
    const productAddOns = rows.map((row) => ({
      id: row.productAddOnId,
      qty: Number(row.qty),
      orderId
    }));

    try {
      await mutateAsync({
        productAddOns,
        imgUrl: file || undefined
      });
      setOpen(false);
      resetState();
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1 text-primary font-semibold text-sm"
        >
          <Plus className="h-4 w-4" />
          Service Add-On
        </button>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-4xl p-6" showCloseButton={false}>
        <DialogHeader className="flex-row items-center justify-between space-y-0">
          <DialogTitle className="text-md font-bold">Service Add-On</DialogTitle>
          <button type="button" className="text-destructive" onClick={() => onOpenChange(false)}>
            <X className="h-6 w-6" />
          </button>
        </DialogHeader>

        <Separator />

        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Service Add-On</Label>
                <Select
                  value={row.productAddOnId}
                  onValueChange={(value) => handleRowChange(row.id, 'productAddOnId', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isFetching ? 'Loading service add-on...' : 'Select service add-on'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {addOns.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {getAddOnLabel(item)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    value={row.qty}
                    onChange={(event) => handleRowChange(row.id, 'qty', event.target.value)}
                  />
                  {rows.length > 1 && (
                    <button
                      type="button"
                      className="text-destructive"
                      onClick={() => handleRemoveRow(row.id)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              type="button"
              className="flex items-center gap-1 text-sm text-primary font-semibold"
              onClick={handleAddRow}
            >
              <Plus className="h-4 w-4" />
              Add Another
            </button>
          </div>
        </div>

        {isPaid && (
          <div className="space-y-2">
            <Label>
              Upload Payment
              <span className="text-destructive">*</span>
            </Label>
            <div className="w-full h-52 rounded-sm overflow-hidden">
              <Uploader
                className="w-full h-full border border-dashed border-border space-y-2"
                onUploaded={(files) => setFile(files[0] || null)}
                multiple={false}
                file={file || undefined}
              >
                <p className="text-sm font-semibold text-primary">
                  Select a file or drag and drop here
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or PDF, file size no more than 10MB
                </p>
              </Uploader>
            </div>
            {file && <p className="text-sm text-muted-foreground">{file.name}</p>}
          </div>
        )}

        <div className="pt-4 flex justify-end">
          <Button type="button" onClick={handleSave} disabled={!canSave} isLoading={isPending}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
