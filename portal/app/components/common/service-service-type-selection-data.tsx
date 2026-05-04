import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import { useController, useWatch, type Control, type FieldArrayWithId } from 'react-hook-form';
import { FormField, FormItem, FormLabel } from '../ui/form';
import FormInput from './form-input';
import { Delete01Icon } from 'hugeicons-react';

type Props = {
  control: Control<DirectSaleProps>;
  fields: FieldArrayWithId<DirectSaleProps, 'pairServices', 'id'>[];
  onRemove: (index: number) => void;
  data?: ServiceServiceTypeAttrubutes;
  isLoading?: boolean;
};
export default function ServiceServiceTypeSelectionData({
  control,
  fields,
  onRemove,
  data
  // isLoading
}: Props) {
  // if (isLoading) return null;

  return fields.map((service, index) => (
    <div className="realtive col-span-1 md:col-span-4" key={service.id}>
      <ServiceItem index={index} control={control} onRemove={onRemove} data={data} canRemove />
    </div>
  ));
}

function ServiceItem({
  control,
  index,
  onRemove,
  data,
  canRemove
}: {
  control: Control<DirectSaleProps>;
  index: number;
  onRemove: (index: number) => void;
  data?: ServiceServiceTypeAttrubutes;
  canRemove: boolean;
}) {
  const selectedServiceId = useWatch({
    control,
    name: `pairServices.${index}.serviceId`
  });

  const durationController = useController({ control, name: `pairServices.${index}.duration` });
  const cleanerCountController = useController({
    control,
    name: `pairServices.${index}.cleanerCount`
  });

  const selectedService = data?.find((item) => `${item.id}` === `${selectedServiceId}`);
  const productOptionV2s = selectedService?.productOptionV2s || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-11 gap-4 md:gap-6 col-span-1 md:col-span-4 md:space-y-6">
      <div className="col-span-2">
        <FormField
          control={control}
          name={`pairServices.${index}.serviceId`}
          render={({ field }) => (
            <FormItem className="gap-x-0">
              <div className="md:hidden flex items-center justify-between flex-1">
                <FormLabel className="">Service ({index + 2})</FormLabel>
                {canRemove && (
                  <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-destructive md:hidden flex"
                  >
                    <Delete01Icon size="20" />
                  </button>
                )}
              </div>
              <Select value={String(field.value)} onValueChange={field.onChange}>
                <SelectTrigger className="w-full truncate">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {(data || []).map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="col-span-2">
        <ServiceOption1
          control={control}
          data={productOptionV2s}
          index={index}
          onChangeCB={(poData) => {
            durationController.field.onChange(poData.duration);
            cleanerCountController.field.onChange(poData.cleanerCount);
          }}
        />
      </div>

      <div className="md:col-span-2 md:grid-cols-2 md:grid gap-6 flex">
        <div className="col-span-1">
          <FormLabel className="md:hidden block mb-2">Bedroom</FormLabel>
          <FormInput
            displayMessage={false}
            control={control}
            name={`pairServices.${index}.bedroomCount`}
          />
        </div>
        <div className="col-span-1">
          <FormLabel className="md:hidden block mb-2">Floor</FormLabel>
          <FormInput
            displayMessage={false}
            control={control}
            name={`pairServices.${index}.floorCount`}
          />
        </div>
      </div>

      <div className="md:col-span-2 md:grid-cols-2 md:grid gap-6 flex">
        <div className="col-span-1">
          <FormLabel className="md:hidden block mb-2">Duration</FormLabel>
          <FormInput
            displayMessage={false}
            control={control}
            name={`pairServices.${index}.duration`}
            disabled
          />
        </div>
        <div className="col-span-1">
          <FormLabel className="md:hidden block mb-2">Cleaner Count</FormLabel>
          <FormInput
            displayMessage={false}
            control={control}
            name={`pairServices.${index}.cleanerCount`}
            disabled
          />
        </div>
      </div>

      <FormInput
        control={control}
        name={`pairServices.${index}.quantity`}
        label="Quantity"
        labelClassName="md:hidden"
      />

      <div className="flex items-center gap-4 col-span-2">
        <div className="w-full">
          <FormInput
            control={control}
            name={`pairServices.${index}.amount`}
            label="Total Amount"
            labelClassName="md:hidden"
          />
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-destructive hidden md:flex"
          >
            <Delete01Icon size="20" />
          </button>
        )}
      </div>
      <div className="col-span-1 block md:hidden h-2 w-full bg-muted mb-4"></div>
    </div>
  );
}

const ServiceOption1 = ({
  control,
  data,
  index,
  onChangeCB
}: {
  data?: ProductOptionAttributes[];
  control: Control<DirectSaleProps>;
  index: number;
  onChangeCB?: (data: ProductOptionAttributes) => void;
}) => {
  return (
    <FormField
      control={control}
      key={index}
      name={`pairServices.${index}.serviceTypeId`}
      render={({ field: serviceField }) => {
        return (
          <FormItem>
            <FormLabel className="md:hidden">Service Type</FormLabel>
            <Select
              value={String(serviceField.value)}
              onValueChange={(v) => {
                serviceField.onChange(v);
                const po = data?.find((d) => d.id.toString() == v);
                if (onChangeCB && po) {
                  onChangeCB(po);
                }
              }}
            >
              <SelectTrigger className="w-full truncate">
                <SelectValue placeholder="Select Service Type" />
              </SelectTrigger>
              <SelectContent>
                {(data || []).map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    {item.nameEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        );
      }}
    />
  );
};
