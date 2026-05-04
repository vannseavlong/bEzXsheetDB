import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';

const chartConfig = {
  cleaning: {
    label: 'Cleaning',
    color: '#3b82f6'
  },
  'deep-cleaning': {
    label: 'Deep Cleaning',
    color: '#8b5cf6'
  },
  'office-cleaning': {
    label: 'Office Cleaning',
    color: '#ec4899'
  },
  upholstery: {
    label: 'Upholstery',
    color: '#10b981'
  },
  'ac-cleaning': {
    label: 'AC Cleaning',
    color: '#f59e0b'
  },
  'washing-machine': {
    label: 'Washing Machine',
    color: '#06b6d4'
  },
  'pest-control': {
    label: 'Pest Control',
    color: '#ef4444'
  }
} satisfies ChartConfig;

type Props = {
  data: LabelValueProps[];
};

const getColor = (type: string) => {
  const normalizedType = type.toLowerCase().replaceAll(' ', '-');
  return chartConfig[normalizedType as keyof typeof chartConfig]?.color || '#94a3b8';
};

export default function OverviewPreferService({ data }: Props) {
  const preferedServices = data.map((item) => ({
    ...item,
    value: Number(item.value),
    fill: getColor(item.label.toLowerCase().replaceAll(' ', '-'))
  }));

  return (
    <Card className="border h-[400px] py-4 gap-0 overflow-hidden min-w-[300px] shrink-0 flex-1">
      <CardHeader className="px-4 pb-4">
        <CardTitle>Preferred Service</CardTitle>
        <div className="flex justify-center">
          <ChartContainer config={chartConfig} className="w-[150px] h-[150px]">
            <PieChart width={150} height={150}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Pie
                data={preferedServices}
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={35}
                strokeWidth={5}
                paddingAngle={2}
                cornerRadius={4}
                dataKey="value"
              >
                {preferedServices.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 items-center p-0 overflow-scroll">
        <div className="flex flex-1 flex-col w-full px-6 gap-4">
          {preferedServices.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: item.fill }}
                ></div>
                <span>{item.label}</span>
              </div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
