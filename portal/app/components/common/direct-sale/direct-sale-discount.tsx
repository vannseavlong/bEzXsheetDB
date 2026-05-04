// import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';
// import { FormField, FormItem, FormLabel } from '../../ui/form';
// import CustomSelect from '../custom-select';
// import { useWatch, type Control } from 'react-hook-form';
// import useCouponQuery from '@/hooks/use-coupon-query';

// type Props = {
//   control: Control<DirectSaleProps>;
// };
// export default function DirectSaleDiscount({ control }: Props) {
//   const discountTypeWatcher = useWatch({ control, name: 'discountType' });
//   const { data } = useCouponQuery({});
//   return (
//     <div className="col-span-3 grid gap-6 grid-cols-3">
//       <FormField
//         control={control}
//         name="discountType"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Discount Type</FormLabel>
//             <CustomSelect
//               data={[
//                 { label: 'Promo Code', value: 'promoCode' },
//                 { label: 'Percentage', value: 'percentage' },
//                 { label: 'Amount', value: 'amount' }
//               ]}
//               value={field.value}
//               onValueChange={field.onChange}
//             />
//           </FormItem>
//         )}
//       />
//       {discountTypeWatcher === 'promoCode' && (
//         <FormField
//           control={control}
//           name="promoCode"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Promo Code</FormLabel>
//               <CustomSelect
//                 data={(data || []).map((item) => ({ label: item.name, value: item.id }))}
//                 value={field.value || ''}
//                 onValueChange={field.onChange}
//               />
//             </FormItem>
//           )}
//         />
//       )}
//       {/* <FormInput
//         disabled
//         control={control}
//         name="totalPayableAmountDisplay"
//         label="Total Amount"
//         placeholder="Total Amount"
//         displayMessage={false}
//       /> */}
//     </div>
//   );
// }
