import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { directSaleScheme, type DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import { Form } from '../../ui/form';
import DirectSaleDetailContent from './direct-sale-detail-content';
import { useDirectSaleUsersAddressQuery } from '@/hooks/query/use-direct-sale-user-query';
import { useProductsByCategoryIdQuery } from '@/hooks/query/use-products-product-option-query';
import useCreateDirectSaleMutation from '@/hooks/mutations/use-create-direct-sale-mutation';
import { toast } from 'sonner';
import useDirectSaleEffect from '@/hooks/use-direct-sale-effect';
import { X } from 'lucide-react';
import { ArrowLeft01Icon } from 'hugeicons-react';

type Props = {
  orderDetail?: OrderListAttributes;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export default function DirectSaleDialog({ orderDetail, isOpen, setIsOpen }: Props) {
  const { mutateAsync: createDirectSale, isPending: isPendingCreateDirectSale } =
    useCreateDirectSaleMutation(orderDetail?.bulkOrderId);

  const form = useForm<DirectSaleProps>({
    mode: 'onSubmit',
    resolver: zodResolver(directSaleScheme),
    defaultValues: {
      vatNo: '',
      customerId: '',
      date: undefined,
      address: '',
      category: '',
      sale: '',
      services: undefined,
      pairServices: [],
      paymentMethod: 'abapay_khqr_deeplink',
      paymentStatus: 'PENDING',
      deposit: '0',
      additionalFee: 0,
      transportFee: 0,
      serviceFee: 0,
      totalPayableAmount: '',
      remark: '',
      reseller: 'none',
      isEdit: false
    }
  });
  const { control } = form;
  const categoryIdWatcher = useWatch({ control, name: 'category' });
  const { directSalePreviewData, isPendingDirectSalePreview } = useDirectSaleEffect({
    form,
    orderDetail
  });

  const totalPayableAmountWAtcher = useWatch({ control, name: 'totalPayableAmount' });
  const saleWatcher = useWatch({ control, name: 'sale' });

  const { data: productData } = useProductsByCategoryIdQuery(categoryIdWatcher);
  const { data } = useDirectSaleUsersAddressQuery({ userId: saleWatcher });

  const onSubmit = async (values: DirectSaleProps) => {
    const addressDetails = data?.find((item) => `${item.id}` === `${values.address}`);

    const directSaleNextPaymentDate = values.nextPaymentDate;
    const directSaleCategory = categoryIdWatcher;
    let directSaleProduct = values.services?.serviceId;
    let directSaleProductOptionV2 = values.services?.serviceTypeId;
    const resellerId = values.reseller === 'none' ? undefined : values.reseller;

    const payload =
      categoryIdWatcher === 'OTHER'
        ? []
        : [
            {
              exchangeRate: values.exchangeRate ? parseInt(values.exchangeRate) : 0,
              vatNo: values.vatNo || undefined,
              id: values.services?.id || undefined,
              categoryId: categoryIdWatcher,
              categoryType: categoryIdWatcher,
              userId: values.customerId,
              saleId: parseInt(values.sale, 10),
              qty: values.services?.quantity ? parseInt(values.services.quantity, 10) : 0,
              amount: values.services?.amount ? parseFloat(values.services.amount) : 0,
              transportFee: values.transportFee,
              additionalFee: values.additionalFee ? values.additionalFee : 0,
              deposit: values.deposit ? values.deposit : 0,
              productOptionIdV2: values.services?.serviceTypeId,
              serviceDuration: values.services?.duration,
              cleanerCount: values.services?.cleanerCount,
              bedroomCount: values.services?.bedroomCount,
              floorCount: values.services?.floorCount,
              directSaleProduct,
              directSaleProductOptionV2,
              directSaleCategory,
              isPrimary: true,
              paymentMethod: values.paymentMethod,
              note: values.remark,
              scheduleStartDate: values.date?.toISOString(),
              address: addressDetails?.address,
              addressId: values.address,
              status: 'PENDING',
              paymentStatus: values.paymentStatus, // "PENDING" | "PARTIALLY_PAID" | "PAID"
              resellerId,
              serviceFee: values.serviceFee,
              directSaleNextPaymentDate
            }
          ];

    (values.pairServices || []).map((item, index) => {
      directSaleProduct = item.serviceId;
      directSaleProductOptionV2 = item.serviceTypeId;
      let isPrimary = false;

      if (categoryIdWatcher === 'OTHER' && index === 0) {
        isPrimary = true;
      }

      payload.push({
        exchangeRate: values.exchangeRate ? parseInt(values.exchangeRate) : 0,

        vatNo: values.vatNo || undefined,
        id: item?.id || undefined,
        categoryId: categoryIdWatcher === 'OTHER' ? item.categoryId || '' : categoryIdWatcher,
        categoryType: categoryIdWatcher,
        userId: values.customerId,
        saleId: parseInt(values.sale, 10),
        qty: item.quantity ? parseInt(item.quantity, 10) : 0,
        amount: item.amount ? parseFloat(item.amount) : 0,
        productOptionIdV2: item.serviceTypeId,
        serviceDuration: item.duration,
        cleanerCount: item.cleanerCount,
        bedroomCount: item.bedroomCount,
        floorCount: item.floorCount,
        transportFee: 0,
        additionalFee: 0,
        deposit: 0,
        directSaleCategory,
        directSaleProduct,
        directSaleProductOptionV2,
        isPrimary,
        paymentMethod: values.paymentMethod,
        note: values.remark,
        scheduleStartDate: values.date?.toISOString(),
        address: addressDetails?.address,
        addressId: values.address,
        status: 'PENDING',
        paymentStatus: values.paymentStatus, // "PENDING" | "PARTIALLY_PAID" | "PAID"
        resellerId,
        serviceFee: values.serviceFee,
        directSaleNextPaymentDate
      });
    });

    const formData = new FormData();
    formData.append('orders', JSON.stringify(payload));
    if (values.file) formData.append('imgUrl', values.file);
    console.log({ payload });
    await createDirectSale(formData);
    form.reset();
    toast.success('Created successfully');
    setIsOpen(false);
  };
  const handleClose = () => {
    console.log({ isOpen });
    setIsOpen(false);
  };

  return (
    <Dialog
      key={isOpen ? orderDetail?.id || 'new' : 'closed'}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Form {...form}>
        <form
          className="hidden"
          key={orderDetail?.id || 'new'} // force RHF re-register
          id="direct-sale-form"
          onSubmit={form.handleSubmit(onSubmit, (error) => console.log('Error:', error))}
        >
          <DialogContent
            showCloseButton={false}
            key={String(isOpen)}
            className="max-w-none w-screen h-screen top-0 left-0 translate-x-0 translate-y-0 border-none rounded-none md:w-full md:max-w-270 md:h-auto md:max-h-[90vh] md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] md:rounded-lg md:border flex flex-col p-0 gap-0"
          >
            <DialogHeader className="border-b p-6 flex flex-row items-center justify-between">
              <div className="flex gap-4 items-center">
                <ArrowLeft01Icon onClick={handleClose} className="flex md:hidden" />
                <DialogTitle>Direct Sale</DialogTitle>
              </div>
              <div
                className="hover:bg-accent hover:text-accent-foreground rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer hidden md:flex"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </div>
            </DialogHeader>
            <div className="flex flex-1 overflow-auto min-h-0 relative">
              <DirectSaleDetailContent
                data={directSalePreviewData?.pairProducts || []}
                productData={productData || []}
                control={control}
                isLoading={isPendingDirectSalePreview}
              />
            </div>

            <DialogFooter className="p-4 md:p-6 border-t bg-background">
              <div className="flex flex-col flex-1">
                <div className="pb-4 flex gap-4 items-center self-end">
                  <div>Total Amount:</div>
                  <div className="font-bold min-w-20 text-right">
                    {totalPayableAmountWAtcher ? `$ ${totalPayableAmountWAtcher}` : '$ 0.00'}
                  </div>
                </div>
                <div className="flex flex-1 justify-end border-t pt-6">
                  <Button
                    isLoading={isPendingCreateDirectSale}
                    form="direct-sale-form"
                    type="submit"
                  >
                    {orderDetail ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
}
