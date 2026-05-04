import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import { type Control } from 'react-hook-form';
import CustomSelect from '../custom-select';
import FormInput from '../form-input';

type Props = {
  control: Control<DirectSaleProps>;
};

export default function DirectSalePayment({ control }: Props) {
  return (
    // <div className="col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
    <>
      <FormField
        control={control}
        name="paymentStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Payment Status</FormLabel>
            <CustomSelect
              data={[
                {
                  label: 'Pending',
                  value: 'PENDING'
                },
                {
                  label: 'Partially Paid',
                  value: 'PARTIALLY_PAID'
                },
                {
                  label: 'Paid',
                  value: 'PAID'
                }
              ]}
              onValueChange={field.onChange}
              value={field.value}
            />
          </FormItem>
        )}
      />
      <FormInput
        type="decimal"
        control={control}
        name="deposit"
        label="Deposit"
        placeholder="Deposit"
        // disabled={paymentStatusWatcher === 'PAID'}
        displayMessage={false}
      />
    </>
  );
}
