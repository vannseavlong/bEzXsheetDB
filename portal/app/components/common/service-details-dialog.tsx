import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent } from '../ui/card';
import { useEffect, useMemo, useState } from 'react';
import useServiceItemsQuery from '@/hooks/query/use-service-item-query';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { groupBy } from 'lodash';
import { useAddServiceItemDetailsMutation } from '@/hooks/mutations/use-add-service-item-details-mutation';
import ServiceDetailsContent from './service-details-content';

export function ServiceDetailsDialog({
  bulkOrderId,
  serviceItemDetails
}: {
  bulkOrderId: string;
  serviceItemDetails?: ServiceItemDetailProps[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useServiceItemsQuery('1');
  const { mutateAsync } = useAddServiceItemDetailsMutation();
  // const [confirmSelectedItem, setConfirmSelectedItem] = useState<{ [id: string]: string[] }>({});
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: string[] }>({});
  const serviceObject = useMemo(() => {
    return groupBy(data, 'id');
  }, [data]);

  const handleAddService = () => setIsOpen(true);

  useEffect(() => {
    if (serviceItemDetails && isOpen) {
      const temp = serviceItemDetails.reduce(
        (acc, item) => {
          acc[item.serviceItemId] = [...item.serviceItemRemarks];
          return acc;
        },
        {} as { [id: string]: string[] }
      );
      setSelectedItems({ ...temp });
    }
  }, [serviceItemDetails, isOpen]);

  const handleSaveClick = async () => {
    const keys = Object.keys(selectedItems);
    const payload: {
      bulkOrderId: string;
      serviceItems: { serviceItemId: string; serviceItemRemarks: string[] }[];
    } = {
      bulkOrderId,
      serviceItems: keys.map((id) => ({
        serviceItemId: id,
        serviceItemRemarks: selectedItems[id]
      }))
    };

    console.log({ payload });
    await mutateAsync(payload);
    setIsOpen(false);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-gray-700">Service Details</h2>
        {serviceItemDetails?.map((item, index) => {
          return (
            <div key={index} className="flex flex-col">
              <div className="flex items-center gap-3">
                <Checkbox id={item.serviceItemId} checked />
                <Label className="flex flex-1" htmlFor={item.serviceItemId}>
                  {serviceObject?.[item.serviceItemId] &&
                  serviceObject?.[item.serviceItemId].length > 0
                    ? serviceObject?.[item.serviceItemId][0].name
                    : ''}
                </Label>
                <Label>x{item.serviceItemRemarks.length}</Label>
              </div>
            </div>
          );
        })}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <div className="justify-end flex">
              <div
                className="text-primary text-sm font-bold cursor-pointer"
                onClick={handleAddService}
              >
                Add Service Detail
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="w-[80vw] h-[80vh] flex flex-col p-0">
            <DialogHeader className="justify-between border-b p-4">
              <DialogTitle>Service</DialogTitle>
            </DialogHeader>
            <ServiceDetailsContent
              selectedServices={selectedItems}
              setSelectedServices={setSelectedItems}
            />
            <DialogFooter className="border-t p-4">
              <Button size="sm" type="button" onClick={handleSaveClick}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
