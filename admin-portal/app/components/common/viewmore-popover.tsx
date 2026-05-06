import { useState } from 'react';
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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import FormInputWithQty from '../order/form-input-with-qty';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { OrderSchema } from '@/lib/schema/order-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Minus } from 'lucide-react';

export function ViewmorePopover() {
  const form = useForm({
    resolver: zodResolver(OrderSchema)
  });

  const onSubmit = async (values: unknown) => {
    console.log('Form submitted with values:', values);
  };

  const [addOns, setAddOns] = useState([{ id: Date.now() }]);

  const handleAddAddOn = () => {
    setAddOns([...addOns, { id: Date.now() }]);
  };

  const handleRemoveAddOn = (id: number) => {
    setAddOns(addOns.filter((item) => item.id !== id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <a className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto cursor-pointer">
          View more
        </a>
      </DialogTrigger>

      <DialogContent className="w-full max-w-[1000px] sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>Service Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <FormInputWithQty
                form={form}
                label="Bathroom"
                placeholder="Enter service details"
                name="serviceBathroom"
                qtyName="bathroom_qty"
              />
              <FormInputWithQty
                form={form}
                label="Living Room"
                placeholder="Enter service details"
                name="servicelivingRoom"
                qtyName="living_room_qty"
              />
              <FormInputWithQty
                form={form}
                label="Kitchen"
                placeholder="Enter service details"
                name="serviceKitchen"
                qtyName="kitchen_qty"
              />
              <FormInputWithQty
                form={form}
                label="Swimming Pool"
                placeholder="Enter service details"
                name="serviceBathroom"
                qtyName="swimming_pool_qty"
              />
              <FormInputWithQty
                form={form}
                label="Balcony"
                placeholder="Enter service details"
                name="servicelivingRoom"
                qtyName="balcony_qty"
              />
              <FormInputWithQty
                form={form}
                label="Lamp or Light"
                placeholder="Enter service details"
                name="serviceKitchen"
                qtyName="lamp_light_qty"
              />
              <FormInputWithQty
                form={form}
                label="Cabinet"
                placeholder="Enter service details"
                name="serviceBathroom"
                qtyName="cabinet_qty"
              />
              <FormInputWithQty
                form={form}
                label="Fridge"
                placeholder="Enter service details"
                name="servicelivingRoom"
                qtyName="fridge_qty"
              />
              <FormInputWithQty
                form={form}
                label="Curtain"
                placeholder="Enter service details"
                name="serviceKitchen"
                qtyName="curtain_qty"
              />
            </div>

            <DialogTitle className="mt-4">Service Add-On</DialogTitle>

            <div>
              {addOns.map((item) => (
                <div key={item.id} className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
                  <div className="grid gap-2">
                    <Label>Product</Label>
                    <Select>
                      <SelectTrigger className="w-full max-w-[1000px] sm:max-w-[1200px]">
                        <SelectValue placeholder="Bed Mattress" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bed">Bed Mattress</SelectItem>
                        <SelectItem value="sofa">Sofa</SelectItem>
                        <SelectItem value="chair">Chair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Variant 1</Label>
                    <Select>
                      <SelectTrigger className="w-full max-w-[1000px] sm:max-w-[1200px]">
                        <SelectValue placeholder="Fridge" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fridge">Fridge</SelectItem>
                        <SelectItem value="fridge2">Fridge2</SelectItem>
                        <SelectItem value="fridge3">Fridge3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Quantity</Label>
                    <div className="flex items-center gap-2">
                      <Select>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Curtain" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="curtain">Curtain</SelectItem>
                          <SelectItem value="curtain2">Curtain2</SelectItem>
                          <SelectItem value="curtain3">Curtain3</SelectItem>
                        </SelectContent>
                      </Select>
                      {addOns.length > 1 && (
                        <Minus
                          className="w-4 h-4 text-red-500 cursor-pointer"
                          onClick={() => handleRemoveAddOn(item.id)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={handleAddAddOn}
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add another service add-on
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              <div className="grid gap-2">
                <Label>Payment Status</Label>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curtain">paid</SelectItem>
                      <SelectItem value="curtain2">unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <div className="flex items-center gap-2">
                  <Select>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="curtain">ABA KHQR</SelectItem>
                      <SelectItem value="curtain2">ACLEDA</SelectItem>
                      <SelectItem value="curtain2">Wing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" name="note" />
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ViewmorePopover;
