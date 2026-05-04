import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import numeral from 'numeral';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import TargetDialog from './target-dialog';
import { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  isLoading?: boolean;
  defaultValue: string;
  dataAmount: {
    totalOrder: string;
    totalDirectSale: string;
    totalCoupon: string;
  };
}

export default function DashboardSaleTargetChart({ isLoading, dataAmount, defaultValue }: Props) {
  const [saleTarget, setSaleTarget] = useState('0');

  const { orderPercentage, directSalePercentage, couponPercentage, totalPercentage, totalRevenue } =
    useMemo(() => {
      const { totalCoupon, totalOrder, totalDirectSale } = dataAmount;

      const total = numeral(totalOrder).add(totalDirectSale).add(totalCoupon).value() || 0;

      const orderPercentage = Math.round(
        numeral(totalOrder).divide(defaultValue).multiply(100).value() || 0
      );
      const directSalePercentage = Math.round(
        numeral(totalDirectSale).divide(defaultValue).multiply(100).value() || 0
      );
      const couponPercentage = Math.round(
        numeral(totalCoupon).divide(defaultValue).multiply(100).value() || 0
      );

      // const paymentLinkPercentage = Math.round(
      //   (Number(totalDirectSale) / Number(defaultValue)) * 100
      // );

      const totalPercentage =
        numeral(orderPercentage).add(directSalePercentage).add(couponPercentage).value() || 0;
      return {
        orderPercentage,
        directSalePercentage,
        couponPercentage,
        totalPercentage,
        totalRevenue: total
      };
    }, [dataAmount, defaultValue]);

  useEffect(() => {
    if (defaultValue) {
      setSaleTarget(defaultValue);
    }
  }, [isLoading, defaultValue]);

  // Data for the gauge - using a pie chart to create a semi-circle effect
  const data = [
    { name: 'Order', value: orderPercentage, fill: 'var(--color-primary)' }, // Blue
    { name: 'DirectSale', value: directSalePercentage, fill: 'var(--color-secondary)' }, // Blue
    {
      name: 'Coupon',
      value: couponPercentage,
      fill: 'color-mix(in srgb, var(--color-secondary), transparent 40%)'
    }, // Blue

    { name: 'Remaining', value: 100 - totalPercentage, fill: '#e5e7eb' } // Light gray
  ];

  return (
    <Card className="w-[280px] h-[400px] border px-4 py-6 gap-0">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle>Sales Target</CardTitle>
        {!isLoading && <TargetDialog onSave={setSaleTarget} value={saleTarget} />}
      </CardHeader>
      {isLoading ? (
        <Skeleton className="w-full h-full mt-4" />
      ) : (
        <CardContent className="space-y-2 p-0 h-full overflow-y-auto">
          <div className="relative flex justify-center">
            <div className="absolute bottom-2 flex items-center justify-center pointer-events-none">
              <p className="text-2xl font-bold">{totalPercentage}%</p>
            </div>

            <ResponsiveContainer width={250} height={125}>
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0];
                      return (
                        <div className="rounded-lg border bg-white p-3 shadow-lg text-sm">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: data.payload.fill }}
                            />
                            <span className="text-gray-500 capitalize">{data.name}:</span>
                            <span className="font-medium">{data.value}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  cornerRadius={4}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-start justify-center gap-6">
            <div className="text-startr">
              <p className="text-lg font-semibold text-primary">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-1 h-6 bg-muted"></div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">${saleTarget}</p>
            </div>
          </div>
          <div className="w-full h-1 bg-muted my-4"></div>
          <div className="flex justify-between">
            <span>App Sale</span>
            <span>${dataAmount.totalOrder.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Direct Sale</span>
            <span>${dataAmount.totalDirectSale.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Coupon</span>
            <span>${dataAmount.totalCoupon.toLocaleString()}</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

{
  /* <p className="text-lg font-semibold text-chart-2">
                ${dataAmount.totalDirectSale.toLocaleString()}
              </p>
              <p className="text-lg font-semibold text-chart-5">
                ${dataAmount.totalCoupon.toLocaleString()}
              </p> */
}
