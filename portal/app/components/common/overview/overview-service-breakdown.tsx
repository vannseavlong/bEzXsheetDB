import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Props = {
  data: ServiceBreakdownProps[];
};

export default function OverviewServiceBreakdown({ data }: Props) {
  const tempData = data.filter((item) => item.category);
  return (
    <Card className="border h-[400px] overflow-hidden min-w-[300px] shrink-0 flex-1">
      <CardHeader>
        <CardTitle>Services Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex overflow-scroll">
        <div className="space-y-3 w-full">
          {tempData.map((service, index) => {
            return (
              <div
                key={index}
                className="flex items-center justify-between pb-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-muted p-2 rounded-lg">
                    <Avatar className="size-10">
                      <AvatarImage src={service.iconUrl} />
                      <AvatarFallback>{service?.category?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{service.category}</p>
                    <p className="text-sm text-muted-foreground">{service.orderCount} Orders</p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">
                  ${service.totalWithVat.toFixed(2)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
