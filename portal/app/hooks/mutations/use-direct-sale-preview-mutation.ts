import api from '@/api/api';
import { API_ENDPOINT } from '@/api/endpoint';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { useMutation } from '@tanstack/react-query';

type Props = {
  pairProducts: ServiceServiceTypeAttrubutes;
};

// type Props = {
//   addOnAmount: string;
//   addOnAmountDisplay: string;
//   amount: string;
//   amountDisplay: string;
//   discount: string;
//   discountDisplay: string;
//   endTime: string;
//   productAddOn: [];
//   pairProducts: ServiceServiceTypeAttrubutes;
//   productOptions: ProductOptionsAttributes[];
//   serviceFee: string;
//   serviceFeeDisplay: string;
//   startDate: string;
//   startTime: string;
//   totalAmount: string;
//   totalAmountDisplay: string;
//   totalPayableAmount: string;
//   totalPayableAmountDisplay: string;
//   totalPayableOriginAmount: string;
//   totalPayableOriginAmountDisplay: string;
//   transportFee: string;
//   transportFeeDisplay: string;
//   vatFee: string;
//   vatFeeDisplay: string;
// };

// type PayloadProps = {
//   userId: string;
//   mainCategoryId: string;

//   paymentMethod: string;
//   productOption: {
//     id: string;
//     qty: string;
//   };
//   productAddOns: {
//     id: string;
//     qty: string;
//   }[];
//   scheduleStartDate: string;
//   couponCode?: string;
//   note?: string;
//   pairOptions: {
//     id: string;
//     qty: string;
//   }[];
//   addressId: string;
//   additionalFee: string;
//   deposit: string;
//   transportFee: string;
// };

export default function useDirectSalePreviewMutation() {
  const apiFn = (payload: { categoryId: string }): Promise<Props> => {
    return api.post(API_ENDPOINT.DIRECT_SALE_PREVIEW, payload);
  };

  return useMutation({
    mutationKey: [QUERY_KEY_ENUM.DIRECT_SALE_PREVIEW],
    mutationFn: apiFn
  });
}
