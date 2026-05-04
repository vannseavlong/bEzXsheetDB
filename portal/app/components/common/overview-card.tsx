import { Card } from '@/components/ui/card';
import clsx from 'clsx';
import { AlertCircleIcon } from 'hugeicons-react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type Props = {
  label: string;
  isLoading?: boolean;
} & TrendProps;

export default function OverviewCard({
  count,
  prevCount,
  trend,
  percentage,
  label,
  isLoading,
  description
}: Props) {
  return (
    <Card className="p-4 border border-border h-31 gap-0 flex justify-between">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">{label}</h3>
        {description && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircleIcon size={16} className="text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="flex items-end justify-between">
        {isLoading ? (
          <Skeleton className="h-[52px] w-[120px] rounded-sm" />
        ) : (
          <ValueDisplay count={count} prevCount={prevCount} />
        )}
        {!trend ? null : trend !== 'none' && count ? (
          <div
            className={clsx(
              'flex items-center gap-1 text-xs font-medium',
              trend === 'down' ? 'text-red-600' : 'text-green-600'
            )}
          >
            {trend === 'down' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
            {percentage ? `${percentage}%` : '-'}
          </div>
        ) : (
          <div className="text-2xl font-bold text-foreground"></div>
        )}
      </div>
    </Card>
  );
}

const ValueDisplay = ({ count, prevCount }: { count: string; prevCount?: string }) => {
  if (prevCount)
    return (
      <div className="flex gap-6">
        <div className="flex flex-col gap-2">
          <span className="text-xs text-foreground">Current</span>
          <span className="text-xl font-bold text-foreground">{count}</span>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs text-foreground">Previous</span>
          <span className="text-xl font-bold text-foreground">{prevCount}</span>
        </div>
      </div>
    );
  return <span className="text-2xl font-bold text-foreground">{count}</span>;
};
