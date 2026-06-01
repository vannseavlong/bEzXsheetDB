import { Star } from "lucide-react";

const SIZE_MAP = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export function StarRating({ rating = 0, size = "sm" }) {
  const clampedRating = Math.max(0, Math.min(5, Math.round(rating)));
  const iconClass = SIZE_MAP[size] ?? SIZE_MAP.sm;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${iconClass} ${
            i < clampedRating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}
