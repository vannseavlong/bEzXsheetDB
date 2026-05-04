import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CustomHeader from '@/components/headers/custom-header';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import CustomSelect from '@/components/common/custom-select';
import ContentWrapper from '@/components/common/content-wrapper';
import { useTranslation } from 'react-i18next';
import FormInputMultipleLanguages from '@/components/common/form-input-multiple-languages';
import FormInput from '@/components/common/form-input';
import { userSchema, type UserSchemaProps } from '@/lib/schema/user-schema';
import ProfilePicker from '@/components/common/profile-picker';
import PopUpUI from '@/components/common/pop-up-ui';
import { useState } from 'react';

export default function NewUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupId] = useState<string>('');
  const handleConfirm = (inputValue?: string) => {
    console.log('Confirmed! Input value:', inputValue);
    // You can run your API call or action here
  };

  const { t } = useTranslation();
  const form = useForm<UserSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: {
        en: '',
        km: '',
        vi: '',
        tw: '',
        cn: ''
      },
      status: 'Active',
      email: '',
      password: '',
      role: 'User'
    }
  });

  const onSubmit = (values: UserSchemaProps) => {
    console.log('User form submitted:', values);
    // Call your API or mutation here
  };

  return (
    <div>
      {/* Header with Save Button */}
      <CustomHeader onSave={form.handleSubmit(onSubmit)} />

      <ContentWrapper>
        <div className="p-6 flex flex-row items-baseline">
          <Card className="flex flex-1">
            <CardHeader className="px-6 pt-6 pb-0">
              <CardTitle>{t('Details')}</CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6">
                    {/* Profile Picker */}
                    <div className="col-span-3 py-6">
                      <ProfilePicker />
                    </div>

                    {/* Name */}
                    <FormInputMultipleLanguages
                      form={form}
                      name="name"
                      label="Name"
                      placeholder="Name"
                    />

                    <FormInput
                      control={form.control}
                      name="email"
                      label={t('Email')}
                      placeholder={t('Email')}
                    />

                    <FormInput
                      control={form.control}
                      name="password"
                      label={t('Password')}
                      placeholder={t('Password')}
                    />

                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('Status')}</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder={t('Select status')}
                            data={[
                              { label: 'Active', value: 'Active' },
                              { label: 'Inactive', value: 'Inactive' },
                              { label: 'Pending', value: 'Pending' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t('Role')}</FormLabel>
                          <CustomSelect
                            className="!h-10"
                            placeholder={t('Select Role')}
                            data={[
                              { label: 'User', value: 'User' },
                              { label: 'Admin', value: 'Admin' },
                              { label: 'Super Admin', value: 'Super Admin' }
                            ]}
                            value={field.value}
                            onValueChange={field.onChange}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <PopUpUI
                      popupId={popupId}
                      open={isOpen}
                      onClose={() => setIsOpen(false)}
                      onConfirm={handleConfirm}
                    />
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
