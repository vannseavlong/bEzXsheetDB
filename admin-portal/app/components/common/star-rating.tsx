import { Star as StarIcon } from 'lucide-react';

export default function StarRating({ count }: { count: number }) {
  return (
    <div className="flex">
      {Array.from({ length: 5 }).map((_, index) =>
        index < count ? (
          <StarIcon key={index} fill="#F6B024" color="#F6B024" />
        ) : (
          <StarIcon key={index} color="#F6B024" />
        )
      )}
    </div>
  );
}
