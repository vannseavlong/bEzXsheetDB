import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import beasyIcon from '/beasy-icon.png'; // use beasy-logo.webp as logo
// import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { signInSchema, type SignInSchemaProps } from '@/lib/schema/signin-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import FormInput from '@/components/common/form-input';
import { useAuth } from '@/hooks/use-auth';
const VITE_ENV = import.meta.env.VITE_ENV;

function LoginPage() {
  const { login, loginLoading } = useAuth();
  const signinForm = useForm<SignInSchemaProps>({
    mode: 'onSubmit',
    resolver: zodResolver(signInSchema),
    defaultValues:
      VITE_ENV === 'dev'
        ? {
            username: 'testing',
            password: '123456789'
          }
        : {
            username: '',
            password: ''
          }
  });

  useEffect(() => {
    console.log('LoginPage');
  }, []);

  const onSubmit = (values: SignInSchemaProps) => {
    login(values);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[1400px]">
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
          {/* Left Image Section - hidden on small screens */}
          <div className="hidden md:flex items-center justify-center overflow-hidden">
            <img
              src="./login.png"
              alt="Description of image"
              className="object-contain w-full h-full max-w-[700px] max-h-[900px]"
            />
          </div>

          {/* Right Login Form Section */}
          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <img src={beasyIcon} alt="Logo" className="w-16 h-16 mx-auto rounded-[8px]" />
              <p className="text-2xl font-bold mt-4 mb-10 text-center">Log in to your Account</p>

              <Form {...signinForm}>
                <form onSubmit={signinForm.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <FormInput
                        control={signinForm.control}
                        name="username"
                        label="Username"
                        placeholder="username"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5 relative">
                      <FormInput
                        control={signinForm.control}
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </div>
                    {/* <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <Label htmlFor="rememberMe">Remember me</Label>
                  </div>
                  <Button variant="link" className="px-0">
                    Forgot Password
                  </Button>
                </div> */}
                    <Button isLoading={loginLoading} type="submit" className="w-full mt-2">
                      Login
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
