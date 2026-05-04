import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '../ui/checkbox';
import type { PushNotificationSchemaProps } from '@/lib/schema/push-notification-schema';
import { type Control } from 'react-hook-form';
import { FormField, FormMessage } from '../ui/form';
import { cn } from '@/lib/utils';

type Props = {
  control: Control<PushNotificationSchemaProps>;
  userType: string;
};

export default function TargetUsersFormV2({ control, userType }: Props) {
  const userTypeOptions = [
    { value: 'user_type_all', label: 'All' },
    { value: 'user_type_guest', label: 'Guest' },
    { value: 'user_type_user', label: 'User' },
    { value: 'user_type_customer', label: 'Customer' }
  ];

  const genderOptions = [
    { value: 'gender_all', label: 'All' },
    { value: 'gender_male', label: 'Male' },
    { value: 'gender_female', label: 'Female' },
    { value: 'gender_unknown', label: 'Prefer not to say' }
  ];

  const ageOptions = [
    { value: 'age_all', label: 'All' },
    { value: 'age_18_24', label: '18 - 24 Years old' },
    { value: 'age_25_34', label: '25 - 34 Years old' },
    { value: 'age_35_44', label: '35 - 44 Years old' },
    { value: 'age_45_54', label: '45 - 54 Years old' },
    { value: 'age_unknown', label: 'Unknown' }
  ];

  return (
    <div className="relative space-y-4">
      <Card className="w-full gap-1">
        <CardHeader className="mb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Target Users</CardTitle>
            <FormMessage />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">User Type</Label>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <FormField
                control={control}
                name={'topics.userType'}
                render={({ field: { value, onChange } }) => (
                  <>
                    {userTypeOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          className={cn(
                            'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                          )}
                          id={`usertype-${option.value}`}
                          // checked={value.includes(option.value)}
                          // onCheckedChange={() => {
                          //   let newVal = value
                          //   if (value.includes(option.value)) {
                          //     newVal = newVal.filter(v => v !== option.value)
                          //   } else {
                          //     newVal = newVal.concat(option.value)
                          //   }
                          //   onChange(newVal)
                          // }}
                          checked={value === option.value}
                          onCheckedChange={() => {
                            onChange(option.value);
                          }}
                        />
                        <Label
                          htmlFor={`usertype-${option.value}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </>
                )}
              />
            </div>
          </div>

          {/* Gender */}
          {userType !== 'user_type_guest' && (
            <>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Gender</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <FormField
                    control={control}
                    name={'topics.gender'}
                    render={({ field: { value, onChange } }) => (
                      <>
                        {genderOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              className={cn(
                                'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                              )}
                              id={`gender-${option.value}`}
                              // checked={value.includes(option.value)}
                              // onCheckedChange={() => {
                              //   let newVal = value
                              //   if (value.includes(option.value)) {
                              //     newVal = newVal.filter(v => v !== option.value)
                              //   } else {
                              //     newVal = newVal.concat(option.value)
                              //   }
                              //   onChange(newVal)
                              // }}
                              checked={value === option.value}
                              onCheckedChange={() => {
                                onChange(option.value);
                              }}
                            />
                            <Label
                              htmlFor={`gender-${option.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>
              {/* Age */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Age</Label>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <FormField
                    control={control}
                    name={'topics.age'}
                    render={({ field: { value, onChange } }) => (
                      <>
                        {ageOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              className={cn(
                                'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                              )}
                              id={`age-${option.value}`}
                              // checked={value.includes(option.value)}
                              // onCheckedChange={() => {
                              //   let newVal = value
                              //   if (value.includes(option.value)) {
                              //     newVal = newVal.filter(v => v !== option.value)
                              //   } else {
                              //     newVal = newVal.concat(option.value)
                              //   }
                              //   onChange(newVal)
                              // }}
                              checked={value === option.value}
                              onCheckedChange={() => {
                                onChange(option.value);
                              }}
                            />
                            <Label
                              htmlFor={`age-${option.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </>
                    )}
                  />
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
