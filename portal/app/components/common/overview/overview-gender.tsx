import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

export const description = 'A donut chart with text';
// 1. Define the type for a single configuration item
type GradientChartConfigItem = {
  label: string;
  gradientStart: string;
  gradientEnd: string;
  // Add any other properties you might need from the original ChartConfig
  // like 'icon', 'color', etc., if you want to keep them.
};

// 2. Define the type for the overall configuration object
type GradientChartConfig = Record<string, GradientChartConfigItem>;

const chartConfig = {
  MALE: {
    label: 'Male',
    gradientStart: '#102c90',
    gradientEnd: '#1b4cfa'
  },
  FEMALE: {
    label: 'Female',
    gradientStart: '#ec4899',
    gradientEnd: '#ec4899'
  },
  'PREFER-NOT-TO-SAY': {
    label: 'Other',
    gradientStart: 'bg-gray-300',
    gradientEnd: 'bg-gray-300'
  }
} satisfies GradientChartConfig;

type Props = {
  isLoading?: boolean;
  data: LabelValueProps[];
};

export default function OverviewGender({ isLoading, data }: Props) {
  const genders = data.map((item) => ({
    ...item,
    // fill: chartConfig[item.label as keyof typeof chartConfig].color
    fill: `url(#gradient-${item.label.toUpperCase()})`
  }));

  console.log({ genders });

  const totalCount = React.useMemo(() => {
    return genders.reduce((acc, curr) => acc + curr.value, 0);
  }, [genders]);

  if (isLoading) {
    return <Skeleton className="h-full w-[400px] shrink-0" />;
  }
  return (
    <Card className="flex flex-col border w-[400px] shrink-0 h-full gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>Gender</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex p-0 items-center">
        <ChartContainer config={chartConfig} className="w-[150px] h-[150px] p-0 m-0">
          <PieChart width={150} height={150}>
            {/* 💡 INSERT THIS BLOCK! */}
            <defs>
              {genders.map((item) => {
                const config = chartConfig[item.label as keyof typeof chartConfig];
                const gradientId = `gradient-${item.label.toUpperCase()}`;

                return (
                  <linearGradient
                    key={gradientId}
                    id={gradientId}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1" // Vertical gradient
                  >
                    <stop offset="0%" stopColor={config.gradientStart} stopOpacity={1} />
                    <stop offset="100%" stopColor={config.gradientEnd} stopOpacity={0.8} />
                  </linearGradient>
                );
              })}
            </defs>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={genders}
              dataKey="value"
              nameKey="label"
              innerRadius={35}
              paddingAngle={2}
              cornerRadius={4}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 8}
                          className="fill-foreground text-sm font-bold"
                        >
                          {totalCount.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-muted-foreground text-sm"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="gap-4 flex flex-col flex-1 pr-4">
          {genders.map((item, index) => (
            <Indicator
              key={item.label}
              label={chartConfig[item.label as keyof typeof chartConfig].label}
              // color={chartConfig[item.label as keyof typeof chartConfig].color}
              color={`bg-chart-${index + 1}`}
              value={`${((item.value / totalCount) * 100).toFixed(0)}%`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const Indicator = ({ label, color, value }: { label: string; color: string; value: string }) => {
  return (
    <div className="flex items-center gap-2 flex-1 ">
      <div className={`w-[6px] h-[6px] rounded-full ${color}`}></div>
      <span className="text-sm">{label}</span>
      <div className="flex flex-1 justify-end">
        <span className="text-sm">{value}</span>
      </div>
    </div>
  );
};
