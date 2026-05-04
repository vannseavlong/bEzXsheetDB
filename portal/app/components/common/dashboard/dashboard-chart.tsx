import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function UserGrowthChart({
  data,
  isLoading
}: {
  data: DashboardChartProps[];
  isLoading?: boolean;
}) {
  const intervalCalc = Math.ceil(data.length / 7) - 1;

  return (
    <Card className="border">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">New Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <span className="text-muted-foreground">Returning Users</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={intervalCalc}
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-white p-3 shadow-lg text-sm">
                          <div className="font-semibold mb-2">{label}</div>
                          {payload.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2 mb-1">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-gray-500 capitalize">{entry.name}:</span>
                              <span className="font-medium">{entry.value} users</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <defs>
                  {/* <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-thisMonth)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-thisMonth)" stopOpacity={0.1} />
              </linearGradient> */}
                  <linearGradient id="newUsersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                {/* Line 1: New Users (Blue, Solid) */}

                {/* 2. Add the Area Component for the Gradient Background */}
                <Area
                  type="monotone"
                  dataKey="newUsers" // Must match the data key of the line
                  stroke="none"
                  fill="url(#newUsersGradient)" // <-- THIS APPLIES THE GRADIENT
                  fillOpacity={1}
                />

                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New Users"
                  stroke="var(--color-primary)" // Blue color
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                />

                {/* Line 2: Returning Users (Red, Dotted) */}
                <Line
                  type="monotone"
                  dataKey="returningUsers"
                  name="Returning Users"
                  stroke="#DC2626" // Red color
                  strokeWidth={2}
                  strokeDasharray="4 4" // This makes it dotted/dashed
                  dot={false}
                  activeDot={{ r: 6, fill: '#DC2626', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
