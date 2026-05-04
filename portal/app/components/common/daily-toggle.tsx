// import { Switch } from '@/components/ui/switch';
// import TimePicker from './draggable/time-picker';
// import { FormField, FormItem, FormMessage } from '../ui/form';
// import { useFieldArray, type Control } from 'react-hook-form';
// import type { PushNotificationSchemaProps } from '@/lib/schema/push-notification-schema';

// type ScheduleProps = {
//   day: string;
//   enabled: boolean;
//   time: string;
// };

// type Props = {
//   control: Control<PushNotificationSchemaProps>;
// };

// export default function DailyToggle({ control }: Props) {
//   const { fields, replace } = useFieldArray({
//     control,
//     name: 'recurrings'
//   });

//   const toggleDay = (index: number) => {
//     replace(fields.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item)));
//     // setSchedule((prev) =>
//     //   prev.map((item, i) => (i === index ? { ...item, enabled: !item.enabled } : item))
//     // );
//   };

//   const handleChangeTime = (index: number, time: string) => {
//     replace(fields.map((item, i) => (i === index ? { ...item, time } : item)));
//   };

//   return (
//     <div className="space-y-4">
//       {fields.map((item, index) => (
//         <div key={item.day} className="space-y-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4 flex-1">
//               <span className="text-sm font-medium text-foreground min-w-[80px]">{item.day}</span>
//             </div>

//             <Switch checked={item.enabled} onCheckedChange={() => toggleDay(index)} />
//           </div>
//           {item.enabled && (
//             <FormField
//               control={control}
//               name="schedulerType"
//               render={({ field }) => {
//                 console.log('asdas', field.value);
//                 return (
//                   <FormItem className="flex flex-col w-[150px]">
//                     <TimePicker time={item.time} onChange={(val) => handleChangeTime(index, val)} />
//                     <FormMessage />
//                   </FormItem>
//                 );
//               }}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
