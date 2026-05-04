import { useEffect } from 'react';
import numeral from 'numeral';
import useDirectSalePreviewMutation from './mutations/use-direct-sale-preview-mutation';
import { useWatch, type UseFormReturn } from 'react-hook-form';
import type { DirectSaleProps } from '@/lib/schema/direct-sale-schema';

type Props = {
  form: UseFormReturn<DirectSaleProps>;
  orderDetail?: OrderListAttributes;
};

export default function useDirectSaleEffect({ form, orderDetail }: Props) {
  const { control } = form;
  const categoryWatcher = useWatch({ control, name: 'category' });
  const servicesWatcher = useWatch({ control, name: 'services' });
  const pairServicesWatcher = useWatch({ control, name: 'pairServices' });
  const additionalFeeWatcher = useWatch({ control, name: 'additionalFee' });
  const serviceFeeWatcher = useWatch({ control, name: 'serviceFee' });
  const transportFeeWatcher = useWatch({ control, name: 'transportFee' });
  const depositWatcher = useWatch({ control, name: 'deposit' });
  const {
    data: directSalePreviewData,
    isPending: isPendingDirectSalePreview,
    mutate
  } = useDirectSalePreviewMutation();

  useEffect(() => {
    if (categoryWatcher && categoryWatcher !== 'OTHER') {
      mutate({ categoryId: categoryWatcher });
    }

    const { isDirty } = form.getFieldState('category', form.formState);

    // If the category matches the initial value (not dirty), we skip resetting the services.
    // This prevents wiping out data that was just loaded from the backend via form.reset().
    if (!isDirty) {
      return;
    }

    form.resetField('services', {
      defaultValue: undefined
    });

    // form.resetField('services', {
    //   defaultValue: {
    //     serviceId: '',
    //     serviceTypeId: '',
    //     duration: '',
    //     cleanerCount: '',
    //     quantity: '1',
    //     amount: ''
    //   }
    // });
    form.resetField('pairServices', {
      defaultValue: []
    });
  }, [categoryWatcher, form, mutate]);

  useEffect(() => {
    if (orderDetail) {
      let payload: DirectSaleProps = {
        vatNo: orderDetail.vatNo || '',
        isEdit: true,
        reseller: orderDetail.reseller?.id ? `${orderDetail.reseller?.id}` : 'none',
        sale: orderDetail.sale?.id ? `${orderDetail.sale?.id}` : 'none',
        customerId: orderDetail.userId ? `${orderDetail.userId}` : '',
        // customerName: orderDetail.fullname || '',
        // phonenumber: orderDetail.phone || '',
        date: new Date(orderDetail.scheduleDate),
        address: orderDetail.addressId ? `${orderDetail.addressId}` : '',
        category: orderDetail.categoryId,
        nextPaymentDate: orderDetail.directSaleNextPaymentDate
          ? new Date(orderDetail.directSaleNextPaymentDate)
          : undefined,
        services: undefined,
        // services: {
        //   serviceId: '',
        //   serviceTypeId: '',
        //   duration: '',
        //   cleanerCount: '',
        //   quantity: '1',
        //   amount: ''
        // },
        paymentMethod: 'abapay_khqr_deeplink',
        paymentStatus: orderDetail.paymentStatus,
        deposit: `${orderDetail.deposit}`,
        additionalFee: orderDetail.additionalFee,
        transportFee: orderDetail.transportFee,
        serviceFee: orderDetail.serviceFee,
        remark: orderDetail.note,
        exchangeRate: orderDetail.exchangeRate ? `${orderDetail.exchangeRate}` : '',
        pairServices: []
      };

      if (!orderDetail.items) {
        form.reset(payload);
        return;
      }

      if (orderDetail.categoryId === 'OTHER') {
        payload = {
          ...payload,
          pairServices: orderDetail.items?.map((item) => ({
            id: `${item.id}`,
            serviceId: item.productId,
            serviceTypeId: item.productOptionId,
            bedroomCount: item.bedroomCount,
            floorCount: item.floorCount,
            duration: item.hourCount,
            cleanerCount: item.cleanerCount,
            categoryId: `${item.categoryId}`,
            quantity: `${item.qty}`,
            amount: `${item.amount}`
          })) as []
        };
      } else {
        payload = {
          ...payload,
          services: {
            id: `${orderDetail.items[0].id}`,
            serviceId: orderDetail.items[0].productId,
            serviceTypeId: orderDetail.items[0].productOptionId,
            bedroomCount: orderDetail.items[0].bedroomCount,
            floorCount: orderDetail.items[0].floorCount,
            duration: orderDetail.items[0].hourCount,
            cleanerCount: orderDetail.items[0].cleanerCount,
            categoryId: `${orderDetail.items[0].categoryId}`,
            quantity: `${orderDetail.items[0].qty}`,
            amount: `${orderDetail.items[0].amount}`
          }
        };
        for (let i = 1; i < orderDetail.items.length; i++) {
          const item = orderDetail.items[i];
          payload.pairServices?.push({
            id: `${item.id}`,
            serviceId: item.productId,
            serviceTypeId: item.productOptionId,
            bedroomCount: item.bedroomCount,
            floorCount: item.floorCount,
            duration: item.hourCount,
            cleanerCount: item.cleanerCount,
            categoryId: `${item.categoryId}`,
            quantity: `${item.qty}`,
            amount: `${item.amount}`
          } as never);
        }
      }
      form.reset(payload);
    }
  }, [form, orderDetail]);

  // const paymentMethodWatcher = useWatch({ control, name: 'paymentMethod' });
  // const userIdWatcher = useWatch({ control, name: 'sale' });
  // const addressWatcher = useWatch({ control, name: 'address' });
  // const serviceAddonWatcher = useWatch({ control, name: 'serviceAddOn' });

  useEffect(() => {
    const serviceFee = numeral(servicesWatcher?.amount || 0);
    pairServicesWatcher?.map((item) => {
      serviceFee.add(item.amount || 0);
    });
    serviceFee.add(additionalFeeWatcher);
    serviceFee.add(serviceFeeWatcher);
    serviceFee.add(transportFeeWatcher);
    serviceFee.subtract(depositWatcher);

    const totalAmount = serviceFee.value() || 0;
    form.setValue('totalPayableAmount', `${totalAmount < 0 ? 0 : totalAmount}`);
  }, [
    servicesWatcher,
    pairServicesWatcher,
    additionalFeeWatcher,
    serviceFeeWatcher,
    depositWatcher,
    transportFeeWatcher,
    form
  ]);

  return {
    directSalePreviewData,
    isPendingDirectSalePreview
  };
}
