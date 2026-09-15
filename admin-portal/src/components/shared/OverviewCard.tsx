import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  blue: "bg-[#E8F0F7] text-[#102C90]",
  amber: "bg-[#FEF7E9] text-[#F6B024]",
  green: "bg-[#E6F9F1] text-[#06C270]",
  purple: "bg-[#1b4cfa1a] text-[#1B4CFA]",
};

export function OverviewCard({
  title,
  value,
  trend = null,
  changePercent = null,
  icon: Icon,
  description,
  tone = "blue",
}) {
  const hasTrend = trend === "up" || trend === "down";

  return (
    <Card className="p-4 gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title ?? "—"}
        </CardTitle>
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              TONE_CLASSES[tone] ?? TONE_CLASSES.blue
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value ?? "—"}
        </div>

        {hasTrend && changePercent != null && (
          <div
            className={cn(
              "mt-1 flex items-center gap-1 text-sm font-medium",
              trend === "up" ? "text-[#06C270]" : "text-[#FF3B3B]"
            )}
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
