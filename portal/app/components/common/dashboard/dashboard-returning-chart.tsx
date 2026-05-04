import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import numeral from 'numeral';

const data = [
  {
    label: 'iOS Return',
    color: 'bg-primary'
  },
  {
    label: 'Android Return',
    color: 'bg-secondary'
  }
];

type Props = {
  returnUser: {
    android: string;
    ios: string;
  };
  isLoading?: boolean;
};

export default function DashboardReturningChart({ returnUser, isLoading }: Props) {
  const total = numeral(returnUser.android).add(returnUser.ios).value();
  const iosPercentage = Math.round((numeral(returnUser.ios).divide(total).value() || 0) * 100);
  const androidPercentage = Math.round(
    (numeral(returnUser.android).divide(total).value() || 0) * 100
  );
  return (
    <Card className="h-[400px] max-w-[400px] min-w-[300px] w-[350px] border gap-0 py-6 overflow-hidden">
      <CardHeader className="px-4">
        <CardTitle>Returning Users</CardTitle>
        <div className="mt-4">
          {isLoading ? (
            <Skeleton className="flex h-8 rounded-sm overflow-hidden mb-4" />
          ) : (
            <div className="flex h-8 rounded-sm overflow-hidden mb-4 gap-1">
              {data.map((item, index) => (
                <div
                  key={item.label}
                  className={`${item.color} rounded-sm`}
                  style={{ width: `${index === 0 ? iosPercentage : androidPercentage}%` }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-0 overflow-y-auto">
        <div className="space-y-3 border rounded-lg flex flex-1 flex-col">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b last:border-0 p-2"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-1 h-[45px] rounded ${item.color}`}></div>
                <span className="text-sm text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm">{index === 0 ? returnUser.ios : returnUser.android}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
