import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import { type Control, type FieldArrayWithId } from 'react-hook-form';
import FormInput from './form-input';
import { Delete01Icon } from 'hugeicons-react';
import { FormField, FormItem, FormLabel } from '../ui/form';
import CustomSelectApi from './custom-select-api';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { API_ENDPOINT } from '@/api/endpoint';

type Props = {
  control: Control<DirectSaleProps>;
  fields: FieldArrayWithId<DirectSaleProps, 'pairServices', 'id'>[];
  onRemove: (index: number) => void;
};
export default function ServiceInputBoxSelectionData({ control, fields, onRemove }: Props) {
  // if (isLoading) return null;

  return fields.map((service, index) => (
    <div
      key={service.id}
      className="grid grid-cols-1 md:grid-cols-10 gap-4 md:gap-6 col-span-1 md:col-span-4"
    >
      <div className="col-span-2">
        <FormInput
          control={control}
          name={`pairServices.${index}.serviceId`}
          label="Service"
          labelClassName="md:hidden"
        />
      </div>
      <div className="col-span-2">
        <FormInput
          control={control}
          name={`pairServices.${index}.serviceTypeId`}
          label="Service Type"
          labelClassName="md:hidden"
        />
      </div>
      {/* <FormInput
        control={control}
        name={`pairServices.${index}.bedroomCount`}
        label="Service Type"
        labelClassName="md:hidden"
      />
      <FormInput
        control={control}
        name={`pairServices.${index}.floorCount`}
        label="Service Type"
        labelClassName="md:hidden"
      /> */}
      <FormInput
        control={control}
        name={`pairServices.${index}.duration`}
        label="Service Type"
        labelClassName="md:hidden"
      />
      <FormInput
        control={control}
        name={`pairServices.${index}.cleanerCount`}
        label="Service Type"
        labelClassName="md:hidden"
      />
      <FormField
        control={control}
        name={`pairServices.${index}.categoryId`}
        render={({ field }) => (
          <FormItem className="col-span-1 relative">
            <FormLabel className="md:hidden">Category</FormLabel>
            <CustomSelectApi
              className="truncate"
              other
              disabledAll
              placeholder="Select Category"
              apiConfig={{
                queryKey: QUERY_KEY_ENUM.CATEGORIES_NAME,
                pathUrl: API_ENDPOINT.CATEGORIES_NAME
              }}
              value={field.value}
              onChange={(val) => {
                field.onChange(val);
              }}
            />
            {/* <FormMessage /> */}
          </FormItem>
        )}
      />
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
        {index > 0 && (
          <button type="button" onClick={() => onRemove(index)} className="text-destructive">
            <Delete01Icon size="20" />
          </button>
        )}
      </div>
    </div>
  ));
}
