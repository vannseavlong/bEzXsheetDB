import { cn } from '@/lib/utils';

type NavBadgeProps = {
  count: number;
  className?: string;
};

export function NavBadge({ count, className }: NavBadgeProps) {
  if (count <= 0) return null;

  return (
    <span
      className={cn(
        'flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full shrink-0',
        'bg-sidebar-primary text-white text-[10px] font-bold leading-none',
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
