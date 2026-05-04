import { Button } from '@/components/ui/button';
import { DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useFieldArray, useFormContext, useWatch, type Control } from 'react-hook-form';
import { type DirectSaleProps } from '@/lib/schema/direct-sale-schema';
import FormInput from '../form-input';
import { FormField, FormItem, FormLabel } from '../../ui/form';
import { DateTimePicker } from '../date-time-picker';
import AddressPicker from '../address-picker';
import CustomSelectApi from '../custom-select-api';
import { QUERY_KEY_ENUM } from '@/constants/query-key-enum';
import { API_ENDPOINT } from '@/api/endpoint';
import DatePicker from '../date-picker';
import CustomSelect from '../custom-select';
import { useDirectSaleUserQuery } from '@/hooks/query/use-direct-sale-user-query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import ServiceOption from './service-option';
import ServiceServiceTypeSelectionData from '../service-service-type-selection-data';
import { Textarea } from '@/components/ui/textarea';
import ServiceInputBoxSelectionData from '../service-input-box-selection-data';
import { useMemo } from 'react';
import DirectSalePayment from './direct-sale-payment';
import { Uploader } from '../uploader';
import DirectSaleCustomerForm from './direct-sale-customer-form';

export default function DirectSaleDetailContent({
  control,
  data,
  isLoading,
  productData
}: {
  control: Control<DirectSaleProps>;
  data?: ServiceServiceTypeAttrubutes;
  productData: ProductAttributes[];
  isLoading?: boolean;
}) {
  const isEditWatcher = useWatch({ control, name: 'isEdit' });
  const categoryIdWatcher = useWatch({ control, name: 'category' });
  const servicesWatcher = useWatch({ control, name: 'services' });
  const paymentStatusWatcher = useWatch({ control, name: 'paymentStatus' });

  const { setValue } = useFormContext<DirectSaleProps>();

  const { data: directSaleUserData } = useDirectSaleUserQuery();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pairServices'
  });

  const resellers = useMemo(() => {
    const temps = (directSaleUserData?.resellers || []).map((item) => ({
      label: `${item.firstName} ${item.lastName} (${item.username})`,
      value: item.id
    }));

    return [{ label: 'None', value: 'none' }].concat(temps);
  }, [directSaleUserData?.resellers]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto gap-6">
      <DialogTitle className="p-4 pb-0">Booking Information</DialogTitle>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-3 px-4">
        <FormField
          control={control}
          name="reseller"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Reseller (Optional)</FormLabel>
              <CustomSelect
                placeholder="Select Reseller (Optional)"
                data={resellers}
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sale"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>
                Select Sale<span className="text-red-500">*</span>
              </FormLabel>
              <CustomSelect
                placeholder="Select Sale"
                data={(directSaleUserData?.users || []).map((item) => ({
                  label: `${item.firstName} ${item.lastName} (${item.username})`,
                  value: item.id
                }))}
                value={field.value}
                onValueChange={field.onChange}
              />
            </FormItem>
          )}
        />

        <AddressPicker control={control} />

        <DirectSaleCustomerForm control={control} />

        <FormField
          control={control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Date<span className="text-red-500">*</span>
              </FormLabel>
              <DateTimePicker
                title="Schedule Date"
                buttonText="Apply"
                haveIcon
                date={field.value}
                onChange={field.onChange}
              />
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <FormField
          control={control}
          name="assignCleaner"
          render={({ field }) => (
            <FormItem>
              <Label>Assign Cleaner</Label>
              <AssignCleaner
                orderCleaners={field.value}
                onChange={(cleaner) => {
                  // if have inside remove else insert
                  if (field.value?.some((item) => item.id === cleaner.id)) {
                    field.onChange(field.value.filter((item) => item.id !== cleaner.id));
                    return;
                  }
                  field.onChange([...(field.value || []), cleaner]);
                }}
              />
            </FormItem>
          )}
        /> */}
        <FormInput
          control={control}
          name="vatNo"
          label="VAT No (Optional)"
          placeholder="VAT No (Optional)"
        />
      </div>
      <div className="col-span-3 grid-cols-1 flex md:hidden ">
        <div className="h-4 w-full bg-muted"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 px-4">
        <h2 className="font-semibold md:hidden flex"> Services</h2>
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem className="col-span-1 gap-x-0">
              <FormLabel>Category</FormLabel>
              <CustomSelectApi
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

        {categoryIdWatcher &&
          (categoryIdWatcher === 'OTHER' ? (
            <FormItem className="col-span-3 grid-cols-10 gap-x-6 hidden md:grid">
              <FormLabel className="col-span-2">
                Service<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel className="col-span-2">
                Service Type<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Duration<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Cleaner<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Expertise<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Quantity<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel className="col-span-2">
                Total Amount<span className="text-red-500">*</span>
              </FormLabel>
            </FormItem>
          ) : (
            <FormItem className="col-span-3 grid-cols-11 gap-x-6 hidden md:grid">
              <FormLabel className="col-span-2">
                Service<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel className="col-span-2">
                Service Type<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>Bedroom</FormLabel>
              <FormLabel>Floor</FormLabel>
              <FormLabel>
                Duration<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Cleaner<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel>
                Quantity<span className="text-red-500">*</span>
              </FormLabel>
              <FormLabel className="col-span-2">
                Total Amount<span className="text-red-500">*</span>
              </FormLabel>
            </FormItem>
          ))}
        {categoryIdWatcher && (
          <FormItem className="col-span-1 grid grid-cols-1 gap-4 md:gap-x-6 md:grid-cols-4 md:col-span-3">
            {categoryIdWatcher === 'OTHER' ? (
              <>
                <ServiceInputBoxSelectionData control={control} fields={fields} onRemove={remove} />
                <div className="col-span-4 flex justify-end">
                  <Button
                    variant="link"
                    type="button"
                    onClick={() => {
                      append({
                        serviceId: '',
                        serviceTypeId: '',
                        duration: '',
                        cleanerCount: '',
                        bedroomCount: '',
                        floorCount: '',
                        quantity: '1',
                        amount: ''
                      });
                    }}
                  >
                    <Plus />
                    Add More Service
                  </Button>
                </div>
              </>
            ) : (
              <FormField
                control={control}
                name="services"
                render={({ field }) => {
                  console.log({ asdasd: field.value });
                  return (
                    <FormItem className="grid grid-cols-1 md:grid-cols-11 col-span-1 md:col-span-4 gap-4 md:gap-x-6">
                      <div className="col-span-2">
                        <FormLabel className="md:hidden block mb-2">Service (1)</FormLabel>
                        <Select
                          value={field.value?.serviceId?.toString()}
                          onValueChange={(val) => {
                            field.onChange({
                              serviceId: `${val}`
                            });
                            setValue('services.serviceTypeId', '');
                            setValue('services.duration', '');
                            setValue('services.cleanerCount', '');
                            setValue('services.bedroomCount', '');
                            setValue('services.floorCount', '');
                          }}
                        >
                          <SelectTrigger className="w-full truncate">
                            <SelectValue placeholder="Select Service" />
                          </SelectTrigger>
                          <SelectContent>
                            {(productData || []).map((item) => (
                              <SelectItem key={item.id} value={String(item.id)}>
                                {item.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <FormLabel className="md:hidden block mb-2">Service Type</FormLabel>
                        <ServiceOption
                          serviceId={field.value?.serviceId}
                          name="services.serviceTypeId"
                          control={control}
                          onChangeCB={(poData) => {
                            setValue('services.bedroomCount', poData.bedroomCount);
                            setValue('services.floorCount', poData.floorCount);
                            setValue('services.duration', poData.duration);
                            setValue('services.cleanerCount', poData.cleanerCount);
                          }}
                        />
                      </div>
                      <div className="md:col-span-2 md:grid-cols-2 md:grid gap-6 flex">
                        <div className="col-span-1">
                          <FormLabel className="md:hidden block mb-2">Bedrooms</FormLabel>
                          <FormInput
                            displayMessage={false}
                            control={control}
                            name="services.bedroomCount"
                          />
                        </div>
                        <div className="col-span-1">
                          <FormLabel className="md:hidden block mb-2">Floor</FormLabel>
                          <FormInput
                            displayMessage={false}
                            control={control}
                            name="services.floorCount"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2 md:grid-cols-2 md:grid gap-6 flex">
                        <div className="col-span-1">
                          <FormLabel className="md:hidden block mb-2">Duration</FormLabel>
                          <FormInput
                            displayMessage={false}
                            control={control}
                            name="services.duration"
                            disabled
                          />
                        </div>
                        <div className="col-span-1">
                          <FormLabel className="md:hidden block mb-2">Cleaner Count</FormLabel>
                          <FormInput
                            displayMessage={false}
                            control={control}
                            name="services.cleanerCount"
                            disabled
                          />
                        </div>
                      </div>
                      <div className="md:col-span-3 md:grid-cols-3 md:grid gap-6 flex">
                        <div className="col-span-1">
                          <FormLabel className="md:hidden block mb-2">Quantity</FormLabel>
                          <FormInput
                            displayMessage={false}
                            control={control}
                            name="services.quantity"
                          />
                        </div>
                        <div className="col-span-2">
                          <FormLabel className="md:hidden block mb-2">Total Amount</FormLabel>
                          <FormInput control={control} name={`services.amount`} />
                        </div>
                      </div>
                    </FormItem>
                  );
                }}
              />
            )}
          </FormItem>
        )}
        {fields.length > 0 && (
          <div className="col-span-1 block md:hidden h-2 w-full bg-muted"></div>
        )}
        {servicesWatcher?.serviceId && (
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-x-6">
            <div className="col-span-4">
              <ServiceServiceTypeSelectionData
                control={control}
                fields={fields}
                onRemove={remove}
                data={data}
                isLoading={isLoading}
              />
            </div>

            <div className="col-span-4 flex justify-end">
              <Button
                variant="link"
                type="button"
                onClick={() => {
                  append({
                    serviceId: '',
                    serviceTypeId: '',
                    duration: '',
                    cleanerCount: '',
                    bedroomCount: '',
                    floorCount: '',
                    quantity: '1',
                    amount: ''
                  });
                }}
              >
                <Plus />
                Add More Service
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="col-span-3 grid-cols-1 flex md:hidden ">
        <div className="h-4 w-full bg-muted"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-6 px-4">
        <DirectSalePayment control={control} />
        <FormInput
          type="decimal"
          control={control}
          name="additionalFee"
          label="Additional Fee"
          placeholder="Additional Fee"
          displayMessage={false}
        />
        <FormInput
          type="decimal"
          control={control}
          name="transportFee"
          label="Transpontation Fee"
          placeholder="Transpontation Fee"
          displayMessage={false}
        />
        <FormInput
          type="decimal"
          control={control}
          name="serviceFee"
          label="Service Fee"
          placeholder="Service Fee"
          displayMessage={false}
        />

        <FormInput
          type="number"
          control={control}
          name="exchangeRate"
          label="Exchange Rate"
          placeholder="Exchange Rate"
          displayMessage={false}
        />

        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <CustomSelect
                data={[
                  { label: 'ABA KHQR', value: 'abapay_khqr_deeplink' },
                  { label: 'Cash', value: 'cash' }
                ]}
                value={field.value}
                onValueChange={field.onChange}
              />
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <FormField
          control={control}
          name="paymentDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Date</FormLabel>
              <DatePicker date={new Date(field.value)} onDateTimeChange={field.onChange} />
            </FormItem>
          )}
        /> */}
        {paymentStatusWatcher !== 'PAID' && (
          <FormField
            control={control}
            name="nextPaymentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Payment Date</FormLabel>
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onDateTimeChange={field.onChange}
                />
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
        )}

        {!isEditWatcher && (
          <FormField
            control={control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <Uploader
                  className="h-15.5"
                  file={field.value}
                  onUploaded={(files) => {
                    field.onChange(files[0]);
                  }}
                >
                  {field.value && (
                    <img
                      className="h-15.5"
                      src={URL.createObjectURL(field.value)}
                      alt="Payment Attachment"
                    />
                  )}
                </Uploader>
              </FormItem>
            )}
          />
        )}
        <FormField
          control={control}
          name="remark"
          render={({ field }) => (
            <FormItem className="col-span-1 md:col-span-3 mb-8">
              <FormLabel>Remark</FormLabel>
              <Textarea placeholder="Remark" value={field.value} onChange={field.onChange} />
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
        {/* <DirectSaleDiscount control={control} /> */}
      </div>
    </div>
  );
}
