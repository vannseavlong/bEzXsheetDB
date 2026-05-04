import { useProductsByCategoryIdQuery } from '@/hooks/query/use-products-product-option-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Skeleton } from '../ui/skeleton';
import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import type { Control, FieldArrayWithId } from 'react-hook-form';
import { FormField, FormItem } from '../ui/form';
import FormInput from './form-input';
import { Delete01Icon } from 'hugeicons-react';
import ServiceOption from './direct-sale/service-option';

type Props = {
  categoryId: string;
  control: Control<DirectSaleProps>;
  fields: FieldArrayWithId<DirectSaleProps, 'pairServices', 'id'>[];
  onRemove: (index: number) => void;
};
export default function ServiceServiceTypeSelection({
  categoryId,
  control,
  fields,
  onRemove
}: Props) {
  const { data: productData, isPending: isPendingProduct } =
    useProductsByCategoryIdQuery(categoryId);

  // console.log({ productAddOnData });
  // if (isPending) return <div>loading...</div>;

  return isPendingProduct ? (
    <div className="grid grid-cols-3 gap-4 col-span-3">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-9 w-full" />
    </div>
  ) : (
    fields.map((service, index) => (
      <FormField
        control={control}
        key={service.id}
        name={`pairServices.${index}.serviceId`}
        render={({ field: serviceField }) => {
          return (
            <FormItem className="grid grid-cols-3 col-span-3 space-x-4">
              <Select value={serviceField.value} onValueChange={serviceField.onChange}>
                <SelectTrigger className="w-auto">
                  <SelectValue placeholder="Select Service" />
                </SelectTrigger>
                <SelectContent>
                  {(productData || []).map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nameEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ServiceOption
                serviceId={serviceField.value}
                name={`pairServices.${index}.serviceTypeId`}
                control={control}
              />
              <div className="col-span-1 flex gap-4 items-center">
                <div className="w-full">
                  <FormInput
                    displayMessage={false}
                    control={control}
                    name={`pairServices.${index}.quantity`}
                  />
                </div>
                <button type="button" onClick={() => onRemove(index)}>
                  <Delete01Icon size="20" className="text-destructive" />
                </button>
              </div>
            </FormItem>
          );
        }}
      />
    ))
  );
}
