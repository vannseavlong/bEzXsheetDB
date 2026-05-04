import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { useState } from 'react';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewCard from '../overview-card';
import { OverviewDescription } from '@/constants/constants';

type Props = {
  data: { label: string; value: string }[];
  payload: {
    [key: string]: TrendProps | undefined;
  };
  isLoading: boolean;
  itemsPerPage: number;
};

export default function OverviewKpi(props: Props) {
  const [page, setPage] = useState(0); // page 0 = first 4, page 1 = next 4
  const [direction, setDirection] = useState(0);
  const maxPage = Math.ceil(props.data.length / props.itemsPerPage) - 1;
  console.log({ props });
  const handleNext = () => {
    setDirection(1);
    setPage(1);
  };

  const handlePrevious = () => {
    setDirection(-1);
    setPage(0);
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 600 : -600,
      opacity: 0,
      position: 'absolute'
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'static'
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -600 : 600,
      opacity: 0,
      position: 'absolute'
    })
  };

  const visibleItems = props.data.slice(
    page * props.itemsPerPage,
    page * props.itemsPerPage + props.itemsPerPage
  );

  if (props.isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-30" />
        <Skeleton className="h-30" />
        <Skeleton className="h-30" />
        <Skeleton className="h-30" />
      </div>
    );
  }
  return (
    <div className="relative">
      {/* Animated Content */}
      <div className="overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'linear' }}
            className={clsx('grid grid-cols-1 sm:grid-cols-2 gap-6', {
              'lg:grid-cols-1': props.itemsPerPage === 1,
              'lg:grid-cols-2': props.itemsPerPage === 2,
              'lg:grid-cols-3': props.itemsPerPage === 3,
              'lg:grid-cols-4': props.itemsPerPage === 4,
              'lg:grid-cols-5': props.itemsPerPage === 5
            })}
          >
            {visibleItems.map((kpi, index) => {
              const trend = props.payload[kpi.value as keyof typeof props.payload] as TrendProps;
              return (
                <OverviewCard
                  key={index}
                  {...trend}
                  label={kpi.label}
                  description={OverviewDescription[kpi.value as keyof typeof OverviewDescription]}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        className={clsx(
          'absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer',
          page === 0 && 'opacity-0 pointer-events-none'
        )}
        onClick={handlePrevious}
      >
        <ArrowLeft01Icon />
      </div>
      <div
        className={clsx(
          'absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer',
          page === maxPage && 'opacity-0 pointer-events-none'
        )}
        onClick={handleNext}
      >
        <ArrowRight01Icon />
      </div>
      {/* <ArrowLeft01Icon /> */}
    </div>
  );
}
