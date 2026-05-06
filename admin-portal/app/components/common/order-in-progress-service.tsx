import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm, FormProvider } from 'react-hook-form';
import FormInputWithQty from '../order/form-input-with-qty';
import { Button } from '../ui/button';
import ViewmorePopover from './viewmore-popover';

type InprogressServiceDetail = {
  description: string;
  quantity: number;
};

type FormData = {
  serviceDetails: InprogressServiceDetail[][];
};

interface ServiceDetailsInProgressProps {
  id: string;
  serviceName: string;
  category: string;
  addOns: number;
  price: number;
  imageSrc: string;
  Serviceitems: InprogressServiceDetail[];
}

interface ServiceCardComponentsProps {
  services: ServiceDetailsInProgressProps[];
}

const ServiceCardInProgress = ({ services }: ServiceCardComponentsProps) => {
  const [expandedServices] = useState<string[]>([]);
  const form = useForm<FormData>({
    defaultValues: {
      serviceDetails: services.map((s) =>
        s.Serviceitems.map((item) => ({
          description: item.description,
          quantity: item.quantity
        }))
      )
    }
  });

  const onSubmit = (data: FormData) => {
    console.log('Submitted Data:', data);
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {services.map((service, serviceIndex) => {
          const isExpanded = expandedServices.includes(service.id);
          const itemsToShow = isExpanded ? service.Serviceitems : service.Serviceitems.slice(0, 4);

          return (
            <>
              <div className="mt-4 mr-4">
                <Card key={service.id} className="bg-card w-auto min-w-[400px] max-w-full p-6 ">
                  <CardHeader className="px-6">
                    <CardTitle className="font-inter text-[16px] font-semibold leading-[20px] text-[#1A1A1A]">
                      {service.serviceName}
                    </CardTitle>
                    <div className="pt-4 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img
                          src={service.imageSrc}
                          alt={service.serviceName}
                          className="w-12 h-12 object-cover rounded-[30px]"
                        />
                        <div className="flex ">
                          <CardTitle className="font-inter text-[16px] font-semibold leading-[20px] text-[#1A1A1A]">
                            {service.category}
                          </CardTitle>
                          <CardDescription className="font-sf-pro text-[14px] font-normal leading-[20px] capitalize text-[#707070]">
                            ({service.addOns} service add-on
                            {service.addOns !== 1 ? 's' : ''})
                          </CardDescription>
                        </div>
                      </div>
                      <CardTitle className="font-inter text-[16px] font-semibold leading-[20px] text-[#1A1A1A]">
                        ${service.price}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <h3 className="font-inter text-[16px] font-semibold leading-[20px] text-[#1A1A1A] mb-6">
                      Service Details
                    </h3>

                    <div className="grid grid-cols-2 gap-6">
                      {itemsToShow.map((_, itemIndex) => (
                        <FormInputWithQty
                          key={`${serviceIndex}-${itemIndex}`}
                          form={form}
                          label={`${service.Serviceitems[itemIndex].description}`}
                          placeholder="Enter description"
                          name={`serviceDetails.${serviceIndex}.${itemIndex}.description` as const}
                          qtyName={`serviceDetails.${serviceIndex}.${itemIndex}.quantity` as const}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-primary hover:text-blue-700 text-sm p-0 h-auto"
                        onClick={() => {}}
                      >
                        <ViewmorePopover />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          );
        })}
      </form>
    </FormProvider>
  );
};

export default ServiceCardInProgress;
