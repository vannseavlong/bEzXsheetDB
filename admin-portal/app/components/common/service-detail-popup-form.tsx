import React from 'react';
import { Minus as MinusSignIcon, Plus } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import CustomSelect from '@/components/common/custom-select';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { isButtonDisabled } from '@/constants/constants';

// Types
export type ServiceDetail = {
  id: string;
  name: string;
  checked: boolean;
};

export type ServiceAddOn = {
  id: string;
  product: string;
  variant: string;
  quantity: string;
};

export type PaymentInformation = {
  id: string;
  paymentStatus: string;
  paymentMethod: string;
  note: string;
};

export interface ServicePopupProps {
  id?: string;
  isOpen: boolean;
  serviceTitle: string;
  formData: {
    serviceDetails: ServiceDetail[];
    serviceAddOn: ServiceAddOn[];
    paymentInformation: PaymentInformation;
  };
  products: { value: string; label: string }[];
  variants: { value: string; label: string }[];
  quantities: { value: string; label: string }[];
  paymentStatuses: { value: string; label: string }[];
  paymentMethods: { value: string; label: string }[];
  onClose: () => void;
  onChange: (formData: ServicePopupProps['formData']) => void;
}

const ServicePopup: React.FC<ServicePopupProps> = (props) => {
  if (!props.isOpen) return null;

  // Handler functions that call props.onChange
  // const handleCheckboxChange = (id: string) => {
  //   const updated = props.formData.serviceDetails.map((item) =>
  //     item.id === id ? { ...item, checked: !item.checked } : item
  //   );
  //   props.onChange({ ...props.formData, serviceDetails: updated });
  // };

  const handleAddOnChange = (
    id: string,
    field: keyof (typeof props.formData.serviceAddOn)[0],
    value: string
  ) => {
    const updated = props.formData.serviceAddOn.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    props.onChange({ ...props.formData, serviceAddOn: updated });
  };

  const handleAddAddOn = () => {
    props.onChange({
      ...props.formData,
      serviceAddOn: [
        ...props.formData.serviceAddOn,
        {
          id: `addon-${Date.now()}`,
          product: '',
          variant: '',
          quantity: ''
        }
      ]
    });
  };

  const handleDeleteAddOn = (id: string) => {
    const updated = props.formData.serviceAddOn.filter((item) => item.id !== id);
    props.onChange({ ...props.formData, serviceAddOn: updated });
  };

  const handlePaymentChange = (
    field: keyof typeof props.formData.paymentInformation,
    value: string
  ) => {
    props.onChange({
      ...props.formData,
      paymentInformation: {
        ...props.formData.paymentInformation,
        [field]: value
      }
    });
  };

  const hasNoData = true; // example condition
  const isLoading = false;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          disabled={isButtonDisabled(hasNoData || isLoading)}
          className="text-blue-600 hover:text-blue-700 text-sm p-0 h-auto cursor-pointer disabled:opacity-100 disabled:text-blue-600 disabled:hover:text-blue-700 disabled:cursor-default"
          variant="ghost"
        >
          View more
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[1000px] sm:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle>{props.serviceTitle}</DialogTitle>
        </DialogHeader>
        {/*     
            <button
              onClick={props.onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={20} className="h-[24px] w-[24px] text-red-500" />
            </button> */}

        {/* Content */}
        <hr />
        <div className="px-6 py-8 space-y-8">
          {/* Service Details */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-6">Service Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {props.formData.serviceDetails.map((item) => (
                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                  <Checkbox
                    checked={item.checked}
                    disabled
                    className="h-[18px] w-[18px] data-[disabled]:opacity-100"
                  />
                  <span className="text-[14px] font-medium text-[#1A1A1A]">{item.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Service Add-On */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-4">Service Add-On</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-[280px_280px_140px_40px] gap-6 mb-2 items-center text-[14px] font-medium text-[#1A1A1A]">
                <span>Product</span>
                <span>Variant</span>
                <span>Quantity</span>
                <span></span>
              </div>

              {props.formData.serviceAddOn.map((addOn) => (
                <div
                  key={addOn.id}
                  className="grid [grid-template-columns:max-content_max-content_1fr] gap-6 items-center mb-6"
                >
                  <CustomSelect
                    className="h-[44px] w-[280px] py-3 text-[14px] font-medium text-[#1A1A1A]"
                    value={addOn.product}
                    onValueChange={(value) => handleAddOnChange(addOn.id, 'product', value)}
                    data={props.products}
                    placeholder="Select Product"
                  />
                  <CustomSelect
                    className="h-[44px] w-[280px] py-3 text-[14px] font-medium text-[#1A1A1A]"
                    value={addOn.variant}
                    onValueChange={(value) => handleAddOnChange(addOn.id, 'variant', value)}
                    data={props.variants}
                    placeholder="Select Variant"
                  />
                  <div className="flex items-center gap-2">
                    <CustomSelect
                      className="h-[44px] w-[280px] py-3 text-[14px] font-medium text-[#1A1A1A]"
                      value={addOn.quantity}
                      onValueChange={(value) => handleAddOnChange(addOn.id, 'quantity', value)}
                      data={props.quantities}
                      placeholder="Qty"
                    />
                    {props.formData.serviceAddOn.length > 1 && (
                      <button
                        onClick={() => handleDeleteAddOn(addOn.id)}
                        className="h-[35px] w-[35px] flex items-center justify-center text-[#FF0000] hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete service add-on"
                      >
                        <MinusSignIcon size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={handleAddAddOn}
                className="flex space-x-2 ml-169 text-[#102C90] text-[14px] hover:text-blue-700 transition-colors"
              >
                <Plus size={16} />
                <span className="text-sm font-medium">Add another service add-on</span>
              </button>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-[16px] font-semibold text-[#1A1A1A] mb-6">Payment Information</h3>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-2">
                  Payment Status
                </label>
                <CustomSelect
                  className="h-[40px] w-[300px] py-3 font-medium text-[#1A1A1A]"
                  value={props.formData.paymentInformation.paymentStatus}
                  onValueChange={(value) => handlePaymentChange('paymentStatus', value)}
                  data={props.paymentStatuses}
                  placeholder="Select Payment Status"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-2 ">
                  Payment Method
                </label>
                <CustomSelect
                  className="h-[40px] w-[300px] py-3 font-medium text-[#1A1A1A]"
                  value={props.formData.paymentInformation.paymentMethod}
                  onValueChange={(value) => handlePaymentChange('paymentMethod', value)}
                  data={props.paymentMethods}
                  placeholder="Select Payment Method"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#1A1A1A] mb-2">Note</label>
                <textarea
                  value={props.formData.paymentInformation.note}
                  onChange={(e) => handlePaymentChange('note', e.target.value)}
                  placeholder="-"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <DialogFooter>
          <DialogClose asChild>
            {/* <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50"> */}
            {/* <Button type="submit" className="bg-[#102C90] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium">
            Save
          </Button> */}
            {/* </div> */}
            <Button type="submit">Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServicePopup;
