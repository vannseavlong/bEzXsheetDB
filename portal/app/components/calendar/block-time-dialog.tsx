import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AddressPicker from '../common/address-picker';
import AssignCleaner from '../common/assign-cleaner';
import { useEffect } from 'react';
import useAuthStore from '@/store/auth-store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import TimePicker from '../common/draggable/time-picker';
import {
  type CreateBlockTimePayload,
  useCreateBlockTimeMutation,
  useDeleteBlockTimeMutation,
  useUpdateBlockTimeMutation
} from '@/hooks/mutations/use-block-time-mutation';
import { useDirectSaleUsersAddressQuery } from '@/hooks/query/use-direct-sale-user-query';

const blockTimeSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  address: z.coerce.number().min(1, 'Location is required'),
  date: z.date({ required_error: 'Date is required' }),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  cleaners: z.array(z.any()).min(1, 'Please select at least one cleaner'),
  sale: z.string().optional() // Required for AddressPicker internal logic
});

type BlockTimeFormValues = z.infer<typeof blockTimeSchema>;

interface BlockTimeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  initialData?: OrderListAttributes;
}

export default function BlockTimeDialog({
  isOpen,
  onOpenChange,
  initialDate,
  initialData
}: BlockTimeDialogProps) {
  const { user } = useAuthStore();
  const { mutateAsync: createBlockTime } = useCreateBlockTimeMutation();
  const { mutateAsync: deleteBlockTime } = useDeleteBlockTimeMutation();
  const { mutateAsync: updateBlockTime } = useUpdateBlockTimeMutation();
  const { data: addressList } = useDirectSaleUsersAddressQuery({
    userId: user?.id ? `${user.id}` : ''
  });

  const form = useForm<BlockTimeFormValues>({
    resolver: zodResolver(blockTimeSchema),
    defaultValues: {
      name: '',
      // address: '',
      cleaners: [],
      sale: user?.id ? `${user.id}` : '',
      startTime: '09:00',
      endTime: '10:00'
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Edit Mode
        form.setValue('name', initialData.note || '');
        if (initialData.address) {
          form.setValue('address', Number(initialData.address));
        }
        form.setValue('cleaners', initialData.cleaners || []);

        const scheduleDate = new Date(initialData.scheduleStartDate);
        form.setValue('date', scheduleDate);

        const hours = scheduleDate.getHours().toString().padStart(2, '0');
        const minutes = scheduleDate.getMinutes().toString().padStart(2, '0');
        form.setValue('startTime', `${hours}:${minutes}`);

        const endDate = new Date(
          scheduleDate.getTime() + (initialData.duration || 1) * 3600 * 1000
        );
        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
        form.setValue('endTime', `${endHours}:${endMinutes}`);
      } else if (initialDate) {
        // Create Mode
        form.reset({
          name: '',
          // address: '',
          cleaners: [],
          sale: user?.id ? `${user.id}` : '',
          startTime: '09:00',
          endTime: '10:00'
        });

        form.setValue('date', initialDate);
        const hours = initialDate.getHours().toString().padStart(2, '0');
        const minutes = initialDate.getMinutes().toString().padStart(2, '0');
        form.setValue('startTime', `${hours}:${minutes}`);
        // Default end time to +1 hour
        const endDate = new Date(initialDate);
        endDate.setHours(endDate.getHours() + 1);
        const endHours = endDate.getHours().toString().padStart(2, '0');
        const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
        form.setValue('endTime', `${endHours}:${endMinutes}`);
      }
    }
  }, [isOpen, initialDate, initialData, form, user]);

  // Sync user id to sale field for AddressPicker
  useEffect(() => {
    if (user?.id) {
      form.setValue('sale', `${user.id}`);
    }
  }, [user, form]);

  const onSubmit = (data: BlockTimeFormValues) => {
    // Construct Schedule Date from date + startTime
    const scheduleStartDate = new Date(data.date);
    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    scheduleStartDate.setHours(startHour, startMinute, 0, 0);

    // Calculate duration
    const [endHour, endMinute] = data.endTime.split(':').map(Number);
    const endDate = new Date(data.date);
    endDate.setHours(endHour, endMinute, 0, 0);

    // Handle overnight? Assuming same day for now based on UI
    if (endDate < scheduleStartDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    // const durationInMillis = endDate.getTime() - scheduleStartDate.getTime();
    // const durationInHours = durationInMillis / (1000 * 60 * 60);

    // const durationInMillis = endDate.getTime() - scheduleStartDate.getTime();
    // const durationInHours = durationInMillis / (1000 * 60 * 60);

    const addressDetail = addressList?.find((a) => Number(a.id) === data.address);

    // Reused payload for both create and update
    const payload: CreateBlockTimePayload = {
      name: data.name,
      address: addressDetail?.address || '',
      status: 'BLOCKED', // Status is 'BLOCKED' for block times
      blockedDate: scheduleStartDate,
      startTime: data.startTime,
      endTime: data.endTime,
      userId: user?.id,
      addressId: data.address,
      latitude: addressDetail?.latitude,
      longitude: addressDetail?.longitude,
      cleanerIds: data.cleaners.map((c: CleanerAttributes) => c.id)
    };

    if (initialData) {
      updateBlockTime({ bulkOrderId: initialData.bulkOrderId, payload })
        .then(() => {
          onOpenChange(false);
          form.reset();
        })
        .catch((err) => {
          console.error('Failed to update block time:', err);
        });
    } else {
      createBlockTime(payload)
        .then(() => {
          onOpenChange(false);
          form.reset();
        })
        .catch((err) => {
          console.error('Failed to create block time:', err);
          // Handle error (e.g. show toast)
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-[600px] sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-7">
          <DialogTitle>Block Time</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <AddressPicker control={form.control} />
              <FormMessage>{form.formState.errors.address?.message}</FormMessage>
            </div>

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col flex-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-[150px]">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onChange={field.onChange}
                        serviceTime={false} // Allow 24h selection potentially? or keep serviceTime=true for business hours
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-[150px]">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <TimePicker
                        time={field.value}
                        onChange={field.onChange}
                        serviceTime={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cleaners"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Cleaners</FormLabel>
                  <div className="border rounded-md p-4">
                    <AssignCleaner
                      orderCleaners={field.value}
                      onChange={(cleaner) => {
                        const currentCleaners = field.value || [];
                        const exists = currentCleaners.find(
                          (c: CleanerAttributes) => c.id === cleaner.id
                        );
                        let newCleaners;
                        if (exists) {
                          newCleaners = currentCleaners.filter(
                            (c: CleanerAttributes) => c.id !== cleaner.id
                          );
                        } else {
                          newCleaners = [...currentCleaners, cleaner];
                        }
                        field.onChange(newCleaners);
                      }}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              {initialData ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    deleteBlockTime(initialData.bulkOrderId).then(() => {
                      onOpenChange(false);
                      form.reset();
                    });
                  }}
                >
                  Delete
                </Button>
              ) : (
                <div /> /* Spacer */
              )}
              <Button type="submit">{initialData ? 'Update' : 'Block Time'}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
