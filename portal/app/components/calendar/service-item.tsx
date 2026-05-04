import React from 'react';
import { Card } from '@/components/ui/card';

type Props = {
  service: ServicesProps;
  index: number;
  icon: string;
};

const ServiceItem: React.FC<Props> = ({ service, icon }) => {
  return (
    <Card className="w-auto py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-start w-full gap-4">
          <img src={icon} alt={icon} className="w-[48px] h-[48px] rounded-full" />
          <div className="flex flex-col flex-1">
            <span className="font-bold text-base">
              {service.categoryNameEn}{' '}
              {service.addOns.length > 0 && <span>({service.addOns.length} Service Add-On)</span>}
            </span>
            <span className="text-sm text-muted-foreground">{service.productOptionEn}</span>
            {service.addOns.map((addOn, index) => (
              <span key={index} className="text-sm text-muted-foreground">
                {addOn.nameEn} x {addOn.qty}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold">{service.amount}$</span>
            <span className="font-bold">{service.qty}x</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceItem;
