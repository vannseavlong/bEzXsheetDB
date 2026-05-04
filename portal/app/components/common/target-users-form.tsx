import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import DeselectableRadioButton from './draggable/deselectable-radio-button';
import { Checkbox } from '../ui/checkbox';
import type {
  PushNotificationSchemaProps,
  TopicSchemaProps
} from '@/lib/schema/push-notification-schema';
import { useFieldArray, type Control } from 'react-hook-form';
// import CustomTabs from './custom-tabs';
// import { useState } from 'react';

type Props = {
  control: Control<PushNotificationSchemaProps>;
};
const tempOff = true;

export default function TargetUsersForm({ control }: Props) {
  // const [, setTabItem] = useState('segment');
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'topics'
  });

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
    { value: 'age_18_24', label: '18 - 24 Years old' },
    { value: 'age_25_34', label: '25 - 34 Years old' },
    { value: 'age_35_44', label: '35 - 44 Years old' },
    { value: 'age_45_54', label: '45 - 54 Years old' },
    { value: 'age_unknown', label: 'Unknown' }
  ];

  const handleUserTypeChange = (index: number, userType: string) => {
    update(index, { ...fields[index], userType });
  };

  const handleGenderToggle = (index: number, gender: string) => {
    const current = fields[index];
    update(index, {
      ...current,
      gender: current.gender === gender ? undefined : gender
    });
  };

  const handleAgeToggle = (index: number, age: string) => {
    const current = fields[index];
    update(index, {
      ...current,
      age: current.age === age ? undefined : age
    });
  };

  const handleAddAnother = () => {
    const newForm: TopicSchemaProps = {
      id: crypto.randomUUID(),
      userType: 'user_type_all',
      gender: undefined,
      age: undefined
    };
    append(newForm);
  };

  return (
    <div className="relative space-y-4">
      {fields.map((form, index) => (
        <Card key={form.id} className="w-full gap-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Target Users {fields.length > 1 ? `#${index + 1}` : ''}
              </CardTitle>
              {index !== 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          {/* <CustomTabs
            defaultValue="segment"
            onChange={setTabItem}
            className="ml-6"
            tabs={[
              { label: 'Segment', value: 'segment' },
              { label: 'Booking History', value: 'booking-history' }
            ]}>
            {(tab) => {
              console.log('value: ', tab.value);
              switch (tab.value) {
                case 'segment':
                  return ( */}
          <CardContent className="space-y-6">
            {/* User Type (Radio-like checkboxes) */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">User Type</Label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {userTypeOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`usertype-${form.id}-${option.value}`}
                      checked={form.userType === option.value}
                      onCheckedChange={() => handleUserTypeChange(index, option.value)}
                      className={cn(
                        'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                      )}
                    />
                    <Label
                      htmlFor={`usertype-${form.id}-${option.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {genderOptions.map((option) => (
                  <DeselectableRadioButton
                    key={option.value}
                    id={`gender-${form.id}-${option.value}`}
                    value={option.value}
                    checked={form.gender === option.value}
                    onToggle={(value) => handleGenderToggle(index, value)}
                    label={option.label}
                  />
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Age</Label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                {ageOptions.map((option) => (
                  <DeselectableRadioButton
                    key={option.value}
                    id={`age-${form.id}-${option.value}`}
                    value={option.value}
                    checked={form.age === option.value}
                    onToggle={(value) => handleAgeToggle(index, value)}
                    label={option.label}
                  />
                ))}
              </div>
            </div>

            {/* Add Another */}
            {index === 0 && !tempOff && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={handleAddAnother}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Another
                </Button>
              </div>
            )}
          </CardContent>
          {/* );

                case 'booking-history':
                  return (
                    <CardContent className="space-y-6">
                      {userTypeOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`usertype-${form.id}-${option.value}`}
                            checked={form.userType === option.value}
                            onCheckedChange={() => handleUserTypeChange(index, option.value)}
                            className={cn(
                              'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                            )}
                          />
                          <Label
                            htmlFor={`usertype-${form.id}-${option.value}`}
                            className="text-sm font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                      {userTypeOptions.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`usertype-${form.id}-${option.value}`}
                            checked={form.userType === option.value}
                            onCheckedChange={() => handleUserTypeChange(index, option.value)}
                            className={cn(
                              'w-4 h-4 rounded-full border-2 border-input flex items-center justify-center'
                            )}
                          />
                          <Label
                            htmlFor={`usertype-${form.id}-${option.value}`}
                            className="text-sm font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </CardContent>
                  );

                default:
                  return;
              }
            }}
          </CustomTabs> */}
        </Card>
      ))}
    </div>
  );
}
