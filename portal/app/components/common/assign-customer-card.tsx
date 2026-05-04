import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import numeral from 'numeral';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Delete02Icon } from 'hugeicons-react';
import type { CustomerSchemaProps } from '@/lib/schema/coupon-schema';
import { useFormContext, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormField, FormItem } from '../ui/form';
import { useAddUserToCouponMutation } from '@/hooks/mutations/use-add-user-to-coupon-mutation';
import { useRemoveUserFromCouponMutation } from '@/hooks/mutations/use-remove-user-from-coupon-mutation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import CustomerDialog from './customer-dialog';

type Props<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  couponId?: string;
  isAssignMenually?: boolean;
  isNew?: boolean;
  excludeUserIds?: string[];
};

export default function AssignCustomersCard<T extends FieldValues>({
  control,
  name,
  isAssignMenually,
  couponId,
  excludeUserIds,
  isNew
}: Props<T>) {
  const form = useFormContext<T>();
  const { mutate: removeUserMutate } = useRemoveUserFromCouponMutation();
  const { mutate } = useAddUserToCouponMutation();

  const getRemaining = (qty?: string, usedCount?: string) => {
    try {
      let remaining;
      if (!isNew) {
        remaining = qty ? numeral(qty).subtract(usedCount).value() : qty;
      }
      // if (usedCount && parseInt(usedCount) > 0 && remaining == 0) {
      //   return 0;
      // }
      return remaining;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return 0;
    }
  };

  return (
    <div className="relative">
      <FormField
        control={control}
        name={name}
        render={({ field }) => {
          return (
            <FormItem>
              <Card className="flex w-full gap-4">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Specific Customers</CardTitle>
                    {(isAssignMenually || isNew) && (
                      <CustomerDialog
                        excludeUserIds={excludeUserIds}
                        onSelect={(user) => {
                          field.onChange([{ ...user, qty: 0, userId: user.id }, ...field.value]);
                        }}
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border border-gray-300">
                    <div className="flex flex-1 bg-muted p-3 gap-4">
                      <div className="w-[280px]">
                        <span className="text-sm">Customers</span>
                      </div>
                      <div className="flex flex-1 gap-4">
                        <div className="flex flex-1">
                          <span className="text-sm">Buy Quantity</span>
                        </div>
                        {!isNew && (
                          <>
                            <div className="w-[70px]">
                              <span className="text-sm">Used</span>
                            </div>
                            <div className="w-[70px]">
                              <span className="text-sm">Remaining</span>
                            </div>
                          </>
                        )}
                        {isAssignMenually && <div className="w-[80px]" />}
                      </div>
                      {isAssignMenually && <div className="w-[10px]"></div>}
                    </div>
                    {field.value.map((user: CustomerSchemaProps, index: number) => {
                      return (
                        <div
                          key={user.id}
                          className="flex gap-4 items-center px-4 py-3 border-b border-gray-300"
                        >
                          <div className="w-[280px]">
                            <span>
                              {user.firstName} {user.lastName} - ({user.username})
                            </span>
                          </div>
                          <FormField
                            control={control}
                            name={`users.${index}.qty` as Path<T>}
                            render={({ field: qtyField, formState }) => {
                              const remaining = getRemaining(qtyField.value, user.usageCount);
                              const userErrors = formState.errors.users as
                                | Array<{ qty?: { message?: string } }>
                                | undefined;
                              const hasError = userErrors?.[index]?.qty;

                              return (
                                <FormItem className="flex flex-1 items-center gap-4">
                                  <div className="flex flex-1 items-center">
                                    <div>
                                      <Input
                                        disabled={!isAssignMenually && !isNew}
                                        type="number"
                                        className={
                                          hasError
                                            ? 'border-destructive text-destructive focus-visible:ring-destructive'
                                            : ''
                                        }
                                        {...qtyField}
                                        onChange={(e) => {
                                          const value = Number(e.target.value);
                                          const usage = Number(user.usageCount);

                                          // Custom validation ONLY for this field on change
                                          if (value < usage) {
                                            form.setError(`users.${index}.qty` as Path<T>, {
                                              type: 'manual',
                                              message: 'Qty cannot be lower than usageCount'
                                            });
                                          } else {
                                            form.clearErrors(`users.${index}.qty` as Path<T>);
                                          }

                                          qtyField.onChange(e.target.value);
                                        }}
                                      />
                                    </div>
                                  </div>
                                  {!isNew && (
                                    <>
                                      <div className="w-[70px]">{user.usageCount}</div>
                                      <div className="w-[70px]">{remaining}</div>
                                    </>
                                  )}

                                  {isAssignMenually && (
                                    <Button
                                      variant="link"
                                      disabled={!qtyField.value || qtyField.value === 0}
                                      type="button"
                                      className="px-0 text-xs"
                                      onClick={() => {
                                        if (!couponId) return;
                                        if (hasError) {
                                          alert('Qty cannot be lower than usageCount');
                                          return;
                                        }
                                        mutate({
                                          couponId,
                                          users: [{ userId: user.id, qty: qtyField.value }]
                                        });
                                      }}
                                    >
                                      Assign Now
                                    </Button>
                                  )}
                                </FormItem>
                              );
                            }}
                          />

                          <AlertDialog>
                            <AlertDialogTrigger
                              asChild
                              className={isAssignMenually || isNew ? '' : 'hidden'}
                            >
                              <Delete02Icon
                                size="18"
                                className="text-destructive cursor-pointer"
                                type="button"
                              />
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmation</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>No</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    if (couponId !== 'new') {
                                      removeUserMutate({
                                        couponId,
                                        userId: user.id
                                      });
                                    }
                                    field.onChange([
                                      ...field.value.filter(
                                        (item: CustomerSchemaProps) => item.id !== user.id
                                      )
                                    ]);
                                  }}
                                >
                                  Yes
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </FormItem>
          );
        }}
      />
    </div>
  );
}
