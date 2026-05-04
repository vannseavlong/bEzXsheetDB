// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import CustomHeader from '@/components/headers/custom-header';
// import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useForm, useWatch, type Control } from 'react-hook-form';
// import CustomSelect from '@/components/common/custom-select';
// import ContentWrapper from '@/components/common/content-wrapper';
// import { useTranslation } from 'react-i18next';
// import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
// import { ValidFromDatePicker } from '@/components/common/single-date-picker';
// import {
//   pushNotificationSchema,
//   type PushNotificationSchemaProps
// } from '@/lib/schema/push-notification-schema';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { DateTimePicker } from '@/components/common/date-time-picker';
// import moment from 'moment';
// import { formatDate, formatTime } from '@/lib/date-helper';
// import Scheduling from '@/components/common/scheduling';

// export default function NewPushNotification() {
//   const { t } = useTranslation();

//   const form = useForm<PushNotificationSchemaProps>({
//     mode: 'onSubmit',
//     resolver: zodResolver(pushNotificationSchema),
//     defaultValues: {
//       name: { en: '', km: '', vi: '', tw: '', cn: '' },
//       description: { en: '', km: '', vi: '', tw: '', cn: '' },
//       schedulerType: 'Now',
//       startDate: formatDate(new Date()),
//       endDate: formatDate(new Date()),
//       startTime: '07:00 AM',
//       endTime: '07:00 AM',
//       recurrings: [
//         {
//           day: 'Monday',
//           time: '07:00 AM',
//           enabled: true
//         },
//         {
//           day: 'Tuesday',
//           time: '07:00 AM',
//           enabled: false
//         },
//         {
//           day: 'Wednesday',
//           time: '07:00 AM',
//           enabled: false
//         },
//         {
//           day: 'Thursday',
//           time: '07:00 AM',
//           enabled: false
//         },
//         {
//           day: 'Friday',
//           time: '07:00 AM',
//           enabled: false
//         },
//         {
//           day: 'Saturday',
//           time: '07:00 AM',
//           enabled: false
//         },
//         {
//           day: 'Sunday',
//           time: '07:00 AM',
//           enabled: false
//         }
//       ],
//       imageUrl: '',
//       pageUrl: ''
//     }
//   });

//   const schedulerType = useWatch({ control: form.control, name: 'schedulerType' });

//   const onSubmit = async (values: PushNotificationSchemaProps) => {
//     console.log('Form submitted with values:', values);
//   };

//   return (
//     <div>
//       <CustomHeader buttonText="send" onSave={form.handleSubmit(onSubmit)} />

//       <ContentWrapper>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="p-6 flex flex-row gap-6 items-baseline">
//             {/* Left side */}
//             <Card className="flex flex-1">
//               <CardHeader className="gap-4">
//                 <CardTitle>{t('productPage.details')}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
//                   <FormInputMultipleLanguages
//                     form={form}
//                     name="name"
//                     label={t('Name')}
//                     placeholder={t('Name')}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="schedulerType"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel>{t('Notification Type')}</FormLabel>
//                         <CustomSelect
//                           className="!h-10"
//                           placeholder={t('Select Notification Type')}
//                           data={[
//                             { label: 'General', value: 'General' },
//                             { label: 'Promotion', value: 'Promotion' }
//                           ]}
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         />
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="targetUser"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel>{t('Targeted Users')}</FormLabel>
//                         <CustomSelect
//                           className="!h-10"
//                           placeholder={t('Select Targeted Users')}
//                           data={[
//                             { label: 'General User', value: 'General User' },
//                             { label: 'Elderly', value: 'Elderly' }
//                           ]}
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         />
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="status"
//                     render={({ field }) => (
//                       <FormItem className="flex flex-col">
//                         <FormLabel>{t('Status')}</FormLabel>
//                         <CustomSelect
//                           className="!h-10"
//                           placeholder={t('Status')}
//                           data={[
//                             { label: 'Active', value: 'Active' },
//                             { label: 'Inactive', value: 'Inactive' },
//                             { label: 'Pending', value: 'Pending' }
//                           ]}
//                           value={field.value}
//                           onValueChange={field.onChange}
//                         />
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   {schedulerType === 'Promotion' && (
//                     <FormField
//                       control={form.control}
//                       name="buddleType"
//                       render={({ field }) => (
//                         <FormItem className="flex flex-col">
//                           <FormLabel>{t('Bundle Type')}</FormLabel>
//                           <CustomSelect
//                             className="!h-10"
//                             placeholder={t('Select Bundle Type')}
//                             data={[
//                               {
//                                 label: 'Bundle Deals - More Saves, More Services!',
//                                 value: 'Bundle Deals - More Saves, More Services!'
//                               },
//                               { label: 'buy-more-pay-less', value: 'buy-more-pay-less' }
//                             ]}
//                             value={field.value}
//                             onValueChange={field.onChange}
//                           />
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   <Label htmlFor="description" className="mb-2 block">
//                     Description
//                   </Label>
//                   <Textarea
//                     id="description"
//                     name="description"
//                     placeholder="Enter description"
//                     className="w-full h-[100PX] rounded-[6px]"
//                   />
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="w-[368px] flex flex-col gap-4 h-full">
//               <Scheduling control={form.control} />
//             </div>
//           </form>
//         </Form>
//       </ContentWrapper>
//     </div>
//   );
// }
