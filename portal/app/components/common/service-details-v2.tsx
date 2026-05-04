import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '../ui/badge';
import numeral from 'numeral';
import { Clock, Users } from 'lucide-react';
import ServiceAddOnDialog from './service-add-on-dialog';
import useProductAddOnByCategoryQuery from '@/hooks/query/use-product-add-on-by-category-query';

type Props = {
  service: ServicesProps;
  index: number;
  icon: string;
  orderStatus?: OrderStatusProps;
  paymentStatus?: string;
  orderType?: string;
};

const ServiceDetailsV2: React.FC<Props> = ({
  service,
  index,
  icon,
  orderStatus,
  paymentStatus,
  orderType
}) => {
  const canShowServiceAddOn =
    (orderStatus === 'PENDING' || orderStatus === 'ACCEPTED') && orderType !== 'DIRECT_SALE';
  const { data: availableAddOns = [] } = useProductAddOnByCategoryQuery(
    service.categoryId,
    canShowServiceAddOn
  );
  const hasServiceAddOn = availableAddOns.length > 0;

  return (
    <Card className="w-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-700">Service {index + 1}</h2>
          {service.isCrossSell && <Badge variant="purple">Cross Sell</Badge>}
        </div>
        {canShowServiceAddOn && hasServiceAddOn && (
          <ServiceAddOnDialog
            categoryId={service.categoryId}
            orderId={service.id || ''}
            paymentStatus={paymentStatus || ''}
          />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4  w-full">
          <img src={icon} alt={icon} className="w-12 h-12 rounded-full" />
          <div className="flex flex-col flex-1">
            <span className="font-bold text-base">
              {service.productEn} ({service.categoryNameEn})
              {service.addOns.length > 0 && <span>({service.addOns.length} Service Add-On)</span>}
            </span>
            <span className="text-sm text-muted-foreground">{service.productOptionEn}</span>
            {(service.floorCount || service.bedroomCount) && (
              <div className="flex text-sm text-muted-foreground">
                {service.floorCount && <span>Floor: {service.floorCount}</span>}
                {service.floorCount && service.bedroomCount && <span className="mx-2">|</span>}
                {service.bedroomCount && <span>Bedrooms: {service.bedroomCount}</span>}
              </div>
            )}
            <div className="flex space-x-4 mb-4">
              {service.hourCount && (
                <div className="flex items-center space-x-1">
                  <Clock size={13} className="text-primary" />
                  <span className="text-sm text-muted-foreground">{service.hourCount} hours</span>
                </div>
              )}
              {service.cleanerCount && (
                <div className="flex items-center space-x-1">
                  <Users size={13} className="text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {service.cleanerCount} Cleaners
                  </span>
                </div>
              )}
            </div>
            {service.addOns.map((addOn, index) => (
              <span key={index} className="text-sm text-muted-foreground mb-0.5">
                {addOn.nameEn} x {addOn.qty}
                {addOn.isRequired && (
                  <Badge variant="purple" className="ml-1 rounded-full">
                    {addOn.groupNameEn}
                  </Badge>
                )}
              </span>
            ))}
          </div>
          {service.isCrossSell && <span className="line-through">{service.amount}$</span>}
          <span className="font-bold">
            {!service.isCrossSell
              ? service.amount
              : numeral(service.amount).subtract(service.discount).value()}
            $
          </span>
        </div>
      </div>
      <span className="font-bold self-end">{service.qty}x</span>
    </Card>
  );
};

export default ServiceDetailsV2;
