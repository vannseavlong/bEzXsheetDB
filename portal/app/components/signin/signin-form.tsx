import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { signInSchema, type SignInSchemaProps } from '@/lib/schema/signin-schema';
import { PasswordInput } from '../common/password-input';

export function SignInForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const signinForm = useForm<SignInSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  async function onSubmit(values: SignInSchemaProps) {
    console.log('call here', values);
    setIsLoading(true);
    // await signIn('credentials', {
    //   ...values,
    // });
    setIsLoading(false);
  }

  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <CardContent>
        <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
        <Form {...signinForm}>
          <form onSubmit={signinForm.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={signinForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={signinForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button isLoading={isLoading} className="w-full mt-4" type="submit">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
