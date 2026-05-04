import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft01Icon, ArrowRight01Icon } from 'hugeicons-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Skeleton } from '@/components/ui/skeleton';
import OverviewCard from '../overview-card';
import { OverviewDescription } from '@/constants/constants';

type Props = {
  data: { [key: string]: TrendProps & { isLoading?: boolean } };
  isLoading?: boolean;
  kpiData: { label: string; value: string }[];
};

const ITEMS_PER_PAGE = 5;

export default function DashboardKpi(props: Props) {
  const [page, setPage] = useState(0); // page 0 = first 4, page 1 = next 4
  const { kpiData, data, isLoading } = props;
  const [direction, setDirection] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handleChange = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    // set initial
    setIsSmallScreen(mq.matches);
    if (mq.addEventListener) mq.addEventListener('change', handleChange);
    else mq.addListener(handleChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handleChange);
      else mq.removeListener(handleChange);
    };
  }, []);

  useEffect(() => {
    if (isSmallScreen) setPage(0);
  }, [isSmallScreen]);

  const itemsPerPage = isSmallScreen ? kpiData.length : ITEMS_PER_PAGE;
  const maxPage = Math.ceil(kpiData.length / itemsPerPage) - 1;

  const handleNext = () => {
    if (page < maxPage) {
      setDirection(1);
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      setDirection(-1);
      setPage((prev) => prev - 1);
    }
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

  const startIndex = Math.min(page * itemsPerPage, Math.max(0, kpiData.length - itemsPerPage));
  const visibleItems = kpiData.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex-1 min-w-[220px]">
            <Skeleton className="h-30" />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="relative">
      {/* Animated Content */}
      <div className="overflow-x-auto relative">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'linear' }}
            className="flex flex-wrap gap-6"
          >
            {visibleItems.map((kpi, index) => {
              const trend = data[kpi.value] as TrendProps;
              return (
                <div key={index} className="flex-1 min-w-[220px]">
                  <OverviewCard
                    {...trend}
                    label={kpi.label}
                    description={OverviewDescription[kpi.value as keyof typeof OverviewDescription]}
                  />
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
      {!isSmallScreen && (
        <>
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
        </>
      )}
      {/* <ArrowLeft01Icon /> */}
    </div>
  );
}
