import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import numeral from 'numeral';

type Props = {
  data: LabelValueProps[];
};

const getColor = (type: string) => {
  try {
    const colors: { [key: string]: string } = {
      facebook: 'bg-primary',
      youtube: 'bg-primary/80',
      instagram: 'bg-primary/50',
      tiktok: 'bg-primary/30',
      other: 'bg-gray-300'
    };
    return colors[type];
  } catch (error) {
    console.log({ error });
    return 'bg-gray-300';
  }
};

export default function OverviewReferralSource({ data }: Props) {
  const total = data.reduce((sum, item) => numeral(sum).add(item.value).value() || 0, 0);
  const referralData = data.map((item) => ({
    ...item,
    color: getColor(item.label.toLowerCase().replaceAll(' ', '-')),
    percentage: Math.round(numeral(item.value).divide(total).multiply(100).value() || 0)
  }));

  return (
    <Card className="border h-[400px] gap-0 py-4 overflow-hidden min-w-[300px] shrink-0 flex-1">
      <CardHeader className="px-4">
        <CardTitle>Referral Source</CardTitle>
        <div className="mt-4">
          <div className="flex h-8 rounded-sm overflow-hidden mb-4 gap-1">
            {referralData.map((item) => (
              <div
                key={item.label}
                className={`${item.color} rounded-sm`}
                style={{
                  width: `${numeral(item.value).divide(total).multiply(100).value() || 0}%`
                }}
              ></div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-scroll">
        <div className="space-y-3 border rounded-lg flex flex-1 flex-col">
          {referralData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b last:border-0 p-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-1 h-[45px] rounded ${item.color}`}></div>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{item.value.toLocaleString()}</span>
                <div className="bg-primary/10 px-2 py-1 rounded text-sm font-semibold border border-primary">
                  {item.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
