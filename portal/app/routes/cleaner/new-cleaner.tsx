import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import ContentWrapper from '@/components/common/content-wrapper';
import FormInput from '@/components/common/form-input';
import ProfilePicker from '@/components/common/profile-picker';
import { cleanerSchema, type CleanerSchemaProps } from '@/lib/schema/cleaner-schema';
import { useCreateCleanerMutation } from '@/hooks/mutations/use-add-cleaner-mutation';
import { useParams } from 'react-router';
import { useCleanerDetailQuery } from '@/hooks/query/use-cleaners-query';
import { useEffect } from 'react';
import DatePicker from '@/components/common/date-picker';

import MultipleSelectSearch from '@/components/common/multiple-select-search';
import useCategoryNamesQuery from '@/hooks/query/use-category-name-query';
import FormCustomSelect from '@/components/common/form-custom-select';
import { Checkbox } from '@/components/ui/checkbox';

const days = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 0 }
];

export default function NewCleaner() {
  const { id } = useParams();
  const { data } = useCleanerDetailQuery(id);
  const { mutate, isPending } = useCreateCleanerMutation(id);
  const { data: categories, isPending: categoryPending } = useCategoryNamesQuery(
    undefined,
    undefined,
    'all'
  );
  const form = useForm<CleanerSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(cleanerSchema),
    defaultValues: {
      cleanerName: '',
      status: 'Active',
      autoAssign: false,
      gender: 'MALE',
      role: 'MEMBER',
      cleanerExpertiseIds: [],
      joinedDate: new Date(),
      image: {
        file: undefined,
        url: ''
      },
      dayOffs: []
    }
  });

  useEffect(() => {
    if (data) {
      const resetValues: CleanerSchemaProps = {
        cleanerName: data.name,
        status: (data.status ? 'Active' : 'Inactive') as 'Active' | 'Inactive',
        autoAssign: data.autoAssign || false,
        gender: (data?.gender as 'MALE' | 'FEMALE') || 'MALE',
        role: (data?.role as 'LEADER' | 'MEMBER') || 'MEMBER',
        joinedDate: data?.joinedDate ? new Date(data?.joinedDate) : new Date(),
        cleanerExpertiseIds: (data.expertiseIds || []).map((id) => id.toString()),
        image: {
          file: undefined,
          url: data.image || ''
        },
        dayOffs: (data.cleanerWeeklyOffs || []).map((id) => id)
      };
      form.reset(resetValues);
    }
  }, [data, form]);

  const onSubmit = (values: CleanerSchemaProps) => {
    // console.log('User form submitted:', values);
    mutate(values);
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader
        isLoading={isPending}
        onSave={form.handleSubmit(onSubmit, (error) => console.log(error))}
      />

      <ContentWrapper>
        <div className="p-6 flex flex-row items-baseline">
          <Card className="flex flex-1 gap-4">
            <CardHeader>
              <CardTitle className="text-base">Account Information</CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (error) => console.log(error))}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                    {/* Profile Picker */}
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <FormField
                        control={form.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <ProfilePicker
                              image={field.value && field.value.url}
                              setImage={field.onChange}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormInput
                      control={form.control}
                      name="cleanerName"
                      label="Name (Khmer)"
                      placeholder="Name"
                    />

                    <FormCustomSelect
                      control={form.control}
                      name="status"
                      label="Status"
                      data={[
                        { label: 'Active', value: 'Active' },
                        { label: 'Inactive', value: 'Inactive' }
                      ]}
                    />

                    <FormCustomSelect
                      control={form.control}
                      name="gender"
                      label="Gender"
                      data={[
                        { label: 'Male', value: 'MALE' },
                        { label: 'Female', value: 'FEMALE' }
                      ]}
                    />

                    <FormField
                      control={form.control}
                      name="cleanerExpertiseIds"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expertise</FormLabel>
                          <MultipleSelectSearch
                            isLoading={categoryPending}
                            placeholder="Select Expertises"
                            onValueChange={field.onChange}
                            data={categories || []}
                            value={field.value || []}
                            labelKey="nameEn"
                            valueKey="id"
                          />

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormCustomSelect
                      control={form.control}
                      name="role"
                      label="Role"
                      data={[
                        { label: 'Leader', value: 'LEADER' },
                        { label: 'Member', value: 'MEMBER' }
                      ]}
                    />

                    <FormField
                      control={form.control}
                      name="joinedDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Joined Date</FormLabel>
                          <DatePicker date={field.value} onDateTimeChange={field.onChange} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoAssign"
                      render={({ field }) => (
                        <FormItem className="flex gap-4 items-center">
                          <Checkbox
                            id="autoAssign"
                            checked={field.value}
                            onCheckedChange={() => field.onChange(!field.value)}
                          />
                          <FormLabel htmlFor="autoAssign">Allow Auto Assign</FormLabel>
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                      <FormLabel>Select Weekly Day Off</FormLabel>

                      <div className="col-span-1 md:col-span-2 flex flex-wrap gap-3 mt-3">
                        {days?.map((item) => (
                          <div key={item.label} className="min-w-[140px]">
                            <FormField
                              control={form.control}
                              name="dayOffs"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex gap-3 items-center">
                                    <Checkbox
                                      id={item.label}
                                      checked={field.value?.includes(item.value)}
                                      onCheckedChange={() => {
                                        if (field.value?.includes(item.value)) {
                                          field.onChange(
                                            field.value.filter((id) => id !== item.value)
                                          );
                                        } else {
                                          field.onChange([...(field.value || []), item.value]);
                                        }
                                      }}
                                    />
                                    <FormLabel htmlFor={item.label}>{item.label}</FormLabel>
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </ContentWrapper>
    </div>
  );
}
