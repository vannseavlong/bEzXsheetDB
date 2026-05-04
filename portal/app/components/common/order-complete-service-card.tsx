import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import ReadOnlyField from './order-input-readonly';
import ViewmorePopover from './viewmore-popover';

// Type for each service detail field
type ServiceDetailComplete = {
  id: string;
  label: string;
  value: string | number;
};

type OrderCompleteServiceProps = {
  id: string;
  service_name: string;
  category: string;
  price: number;
  addOn: number;
  imageSrc: string;
  CompleteserviceDetails: ServiceDetailComplete[];
};

export function OrderCompleteServiceData({
  id,
  service_name,
  category,
  price,
  addOn,
  imageSrc,
  CompleteserviceDetails
}: OrderCompleteServiceProps) {
  const fields = CompleteserviceDetails.map((field) => ({
    ...field,
    id: `${id}-${field.id}`
  }));

  return (
    <Card className="w-155 max-w-2xl mx-auto rounded-[12px] p-6 m-6">
      <CardHeader className="px-6">
        <CardTitle className="font-inter text-[16px] font-semibold leading-5 text-[#1A1A1A]">
          {service_name}
        </CardTitle>
        <div className="pt-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={imageSrc}
              alt={service_name}
              className="w-12 h-12 object-cover rounded-[30px]"
            />
            <div className="flex">
              <CardTitle className="font-inter text-[16px] font-semibold leading-5 text-[#1A1A1A]">
                {category}
              </CardTitle>
              <CardDescription className="font-sf-pro text-[14px] font-normal leading-5 capitalize text-[#707070]">
                ({addOn} service add-on{addOn > 1 ? 's' : ''})
              </CardDescription>
            </div>
          </div>
          <CardTitle className="font-inter text-[16px] font-semibold leading-5 text-[#1A1A1A]">
            ${price}
          </CardTitle>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent>
        <h3 className="font-inter text-[16px] font-semibold leading-5 text-[#1A1A1A] mb-6">
          Service Details
        </h3>
        <div className="grid grid-cols-2 gap-6">
          {fields.map(({ id, label, value }) => (
            <ReadOnlyField key={id} id={id} label={label} value={value} />
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
  );
}
