import { useProductOptionByProductIdQuery } from '@/hooks/query/use-products-product-option-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormField, FormItem } from '../../ui/form';

type Props<T extends FieldValues> = {
  control: Control<T>;
  serviceId?: string;
  name: Path<T>;
  onChangeCB?: (data: ProductOptionAttributes) => void;
};

export default function ServiceOption<T extends FieldValues>({
  control,
  serviceId,
  name,
  onChangeCB
}: Props<T>) {
  const { data } = useProductOptionByProductIdQuery(serviceId);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedLabel =
          field.value && data?.find((d) => String(d.id) === String(field.value))?.nameEn;
        return (
          <FormItem className="col-span-1 relative">
            <Select
              value={String(field.value)}
              onValueChange={(val) => {
                field.onChange(String(val));
                const po = data?.find((d) => d.id.toString() == val);
                if (onChangeCB && po) {
                  onChangeCB(po);
                }
              }}
            >
              <SelectTrigger className="w-full truncate">
                {selectedLabel ? selectedLabel : <SelectValue placeholder="Select Service Type" />}
              </SelectTrigger>
              <SelectContent className="">
                {(data || []).map((item) => (
                  <SelectItem key={item.id} value={String(item.id)}>
                    <div className="flex flex-col">
                      <span>{item.nameEn}</span>
                      {/* Use a container with a smaller font for the dropdown details */}
                      {(item.floorCount || item.bedroomCount) && (
                        <div className="flex text-xs text-muted-foreground pointer-events-none">
                          {item.floorCount && <span>Floor: {item.floorCount}</span>}
                          {item.floorCount && item.bedroomCount && <span className="mx-1">|</span>}
                          {item.bedroomCount && <span>Bedrooms: {item.bedroomCount}</span>}
                        </div>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        );
      }}
    />
  );
}
