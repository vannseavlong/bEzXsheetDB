import { Skeleton } from "@/components/ui/skeleton";

// Varying widths to simulate realistic table content
const COLUMN_WIDTHS = [
  ["w-8", "w-32", "w-24", "w-16", "w-20", "w-12"],
  ["w-6", "w-40", "w-28", "w-20", "w-16", "w-10"],
  ["w-10", "w-36", "w-20", "w-24", "w-18", "w-14"],
  ["w-7", "w-28", "w-32", "w-18", "w-22", "w-8"],
];

export function LoadingSkeleton({ rows = 5, columns = 4 }) {
  const safeRows = Math.max(1, rows);
  const safeCols = Math.max(1, columns);

  return (
    <div className="w-full space-y-0">
      {/* Header row */}
      <div
        className="grid gap-4 border-b px-4 py-3"
        style={{ gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: safeCols }, (_, ci) => (
          <Skeleton key={ci} className="h-4 w-20" />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: safeRows }, (_, ri) => (
        <div
          key={ri}
          className="grid gap-4 border-b px-4 py-3 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${safeCols}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: safeCols }, (_, ci) => {
            const widthClass =
              COLUMN_WIDTHS[ri % COLUMN_WIDTHS.length][
                ci % COLUMN_WIDTHS[0].length
              ];
            return (
              <Skeleton
                key={ci}
                className={`h-4 ${widthClass}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
