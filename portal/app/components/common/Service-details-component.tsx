import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { serviceDetailsPopupDummy } from '@/constants/data-dummy';
import ServicePopup from './service-detail-popup-form';

const ServiceDetails: React.FC<OrderListAttributes> = (props) => {
  const [serviceItems, setServiceItems] = useState<OrderListAttributes[]>(props.items ?? []);

  const toggleItem = (index: number) => {
    const newItems = [...serviceItems];
    newItems[index].checked = !newItems[index].checked;
    setServiceItems(newItems);
  };

  const [formData, setFormData] = useState(serviceDetailsPopupDummy.formData);
  const [isPopupOpen, setIsPopupOpen] = useState(serviceDetailsPopupDummy.isOpen);

  const handleFormChange = (newFormData: typeof formData) => {
    setFormData(newFormData);
  };

  return (
    <div className="mt-4 mr-4">
      <Card className="bg-card w-auto min-w-[400px] max-w-full p-6">
        <CardHeader className="px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-700">
              {props.Servicename}{' '}
              <span className="text-sm text-gray-400 ml-2">#{props.bulkOrderId}</span>
            </h2>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center">
                <img
                  src={props.img}
                  alt={props.category}
                  className="w-[48px] h-[48px] rounded-full"
                />
              </div>
              <div>
                <span className="font-bold text-base text-[#1A1A1A]">{props.category}</span>
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({props.addOns ?? 0} Service Add-On{(props.addOns ?? 0) > 1 ? 's' : ''})
                </span>
              </div>
            </div>
            <span className="font-bold text-[16px] text-[#1A1A1A]">
              ${props.price?.toFixed(2) ?? '0.00'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-semibold text-base text-gray-900 mb-6">Service Details</h3>
          <div className="grid grid-cols-3 gap-y-6 gap-x-6">
            {serviceItems.map((item, index) => (
              <div key={item.bulkOrderId ?? index} className="flex items-center gap-3">
                <Checkbox
                  id={`service-${item.bulkOrderId}`}
                  checked={item.checked}
                  onCheckedChange={() => toggleItem(index)}
                  className="w-[20px] h-[20px] text-blue-600 border-gray-300"
                />
                <label
                  htmlFor={`service-${item.bulkOrderId}`}
                  className="text-[14px] font-medium text-[#1A1A1A] cursor-pointer"
                >
                  {item.Servicename}
                </label>
              </div>
            ))}
          </div>

          {serviceItems.length > 18 && (
            <div className="mt-4 flex justify-end">
              {/* <ViewmorePopover /> */}
              <ServicePopup
                id={serviceDetailsPopupDummy.id}
                serviceTitle={serviceDetailsPopupDummy.serviceTitle}
                isOpen={isPopupOpen}
                formData={formData}
                products={serviceDetailsPopupDummy.products}
                variants={serviceDetailsPopupDummy.variants}
                quantities={serviceDetailsPopupDummy.quantities}
                paymentStatuses={serviceDetailsPopupDummy.paymentStatuses}
                paymentMethods={serviceDetailsPopupDummy.paymentMethods}
                onClose={() => setIsPopupOpen(false)}
                onChange={handleFormChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceDetails;
