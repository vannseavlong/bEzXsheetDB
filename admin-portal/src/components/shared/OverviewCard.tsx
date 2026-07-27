import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function OverviewCard({
  title,
  value,
  trend = null,
  changePercent = null,
  icon: Icon,
  description,
}) {
  const hasTrend = trend === "up" || trend === "down";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title ?? "—"}
        </CardTitle>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {value ?? "—"}
        </div>

        {hasTrend && changePercent != null && (
          <div
            className={`mt-1 flex items-center gap-1 text-sm font-medium ${
              trend === "up" ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {trend === "up" ? "+" : "-"}
              {Math.abs(changePercent)}%
            </span>
          </div>
        )}

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
