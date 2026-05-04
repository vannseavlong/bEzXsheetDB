import { Skeleton } from '../ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div className="flex flex-1 flex-col p-4 gap-4">
      <Skeleton className="w-full h-[233px]" />
      <div className="grid grid-cols-3 gap-4">
        <HomeItem />
        <HomeItem />
        <HomeItem />
        <HomeItem />
        <HomeItem />
        <HomeItem />
      </div>
    </div>
  );
}

const HomeItem = () => {
  return (
    <div className="p-4 flex flex-col items-center justify-center">
      <Skeleton className="w-12 h-12 rounded-md flex items-center justify-center mx-auto mb-3" />
      <Skeleton className="w-12 h-4" />
    </div>
  );
};
