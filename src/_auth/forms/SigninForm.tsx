import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Lock, LogIn, Mail } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const SigninForm = () => {
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
    console.log('submit sign in form.');
    toast('sign in successful');
    navigate('/');
  };

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-950'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-2 text-center'>
          <LogIn className='mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-500' />
          <CardTitle className='text-3xl font-bold'>Sign In</CardTitle>
          <CardDescription>Access your Products Management dashboard.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form {...form}>
            {' '}
            {/* Spread form methods into Shadcn Form component */}
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <div className='relative'>
                      <Mail className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
                      <FormControl>
                        <Input
                          type='email'
                          placeholder='name@example.com'
                          className='pl-9' // Padding for the icon
                          {...field} // Spread field props (onChange, onBlur, value, ref)
                        />
                      </FormControl>
                    </div>
                    <FormMessage /> {/* Displays Zod validation error for this field */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className='relative'>
                      <Lock className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
                      <FormControl>
                        <Input
                          type='password'
                          placeholder='••••••••'
                          className='pl-9' // Padding for the icon
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage /> {/* Displays Zod validation error for this field */}
                  </FormItem>
                )}
              />

              {/* Display general auth error from context, only if not a field-specific Zod error */}

              <Button type='submit' className='!mt-6 w-full'>
                {'Sign In'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SigninForm;
