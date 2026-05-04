// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
// import { DateTimePicker } from './date-time-picker';
// import type { PushNotificationSchemaProps } from '@/lib/schema/push-notification-schema';
// import { useWatch, type Control } from 'react-hook-form';
// import { FormField, FormItem } from '../ui/form';
// import DailyToggle from './daily-toggle';

// type Props = {
//   control: Control<PushNotificationSchemaProps>;
// };

// export default function Scheduling({ control }: Props) {
//   const scheduleData: string[] = ['Now', 'Schedule', 'Recurring'];
//   const scheduleType = useWatch({ control: control, name: 'schedulerType' });

//   return (
//     <Card className="flex-1">
//       <CardHeader className="gap-4 flex-col">
//         <CardTitle>Scheduling</CardTitle>
//         <FormField
//           control={control}
//           name="schedulerType"
//           render={({ field }) => (
//             <FormItem className="flex flex-col flex-1">
//               <Select value={field.value} onValueChange={field.onChange}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {scheduleData.map((item) => (
//                     <SelectItem key={item} value={item}>
//                       {item}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </FormItem>
//           )}
//         />
//       </CardHeader>
//       {scheduleType === 'Schedule' && (
//         <CardContent className="flex flex-col gap-4">
//           <div className="gap-4 flex-col flex">
//             <DateTimePicker
//               control={control}
//               dateName="startDate"
//               timeName="startTime"
//               label="Start Date"
//             />
//             <DateTimePicker
//               control={control}
//               dateName="endDate"
//               timeName="endTime"
//               label="End Date"
//             />
//           </div>
//         </CardContent>
//       )}
//       {scheduleType === 'Recurring' && (
//         <CardContent className="flex flex-col gap-4">
//           <DailyToggle control={control} />
//         </CardContent>
//       )}
//     </Card>
//   );
// }
