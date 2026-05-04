// import { Calendar } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Calendar as CalendarComponent } from '../ui/calendar';
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
// import { format } from 'date-fns';
// import clsx from 'clsx';
// import { useState } from 'react';

// export type DateRangePickerProps = {
//   dateRange: { from?: Date; to?: Date };
//   setDateRange: (range: { from?: Date; to?: Date }) => void;
//   isCalendarOpen: boolean;
//   setIsCalendarOpen: (open: boolean) => void;
//   iconHidden?: boolean;
//   className?: string;
//   initialDateRange?: { from?: Date; to?: Date };
// };

// export default function DateRangePicker({
//   dateRange,
//   setDateRange,
//   isCalendarOpen,
//   setIsCalendarOpen,
//   iconHidden,
//   className,
//   initialDateRange
// }: DateRangePickerProps) {
//   const [selectedRange, setSelectedRange] = useState<{ from?: Date; to?: Date }>({ ...dateRange });
//   const handleReset = () => {
//     setSelectedRange(
//       initialDateRange || {
//         from: undefined,
//         to: undefined
//       }
//     );
//   };

//   const handleApply = () => {
//     setDateRange({ ...selectedRange });
//     setIsCalendarOpen(false);
//   };

//   return (
//     <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           size="sm"
//           variant="outline"
//           className={clsx('gap-2 bg-transparent min-w-[140px] justify-start', className)}>
//           <Calendar className={clsx('h-4 w-4', { hidden: iconHidden })} />
//           {selectedRange.from && selectedRange.to
//             ? `${format(selectedRange.from, 'dd MMM, yyyy')} - ${format(selectedRange.to, 'dd MMM, yyyy')}`
//             : 'Select date range'}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start" side="left">
//         <CalendarComponent
//           mode="range"
//           selected={{
//             from: selectedRange.from,
//             to: selectedRange.to
//           }}
//           onSelect={(range) => {
//             if (range) {
//               setSelectedRange({
//                 from: range.from,
//                 to: range.to
//               });
//             }
//           }}
//           numberOfMonths={1}
//           className="rounded-md border"
//         />
//         <div className="p-4 flex items-end justify-end gap-4">
//           <Button onClick={handleReset} size="sm" variant="secondary">
//             Reset
//           </Button>
//           <Button onClick={handleApply} size="sm">
//             Apply
//           </Button>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// }
