import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, AtSign, UserPlus } from 'lucide-react';

import { signupSchema, type SignupFormValues } from '@/lib/schemas';
import { useUserContext } from '@/context/AuthContext';
import { createUserAccount, signInAccount } from '@/lib/appwrite/api';

const SignupForm = () => {
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isAuthLoading } = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      const newUser = await createUserAccount(data);

      if (!newUser) {
        toast.error('Sign up failed: Could not create user. Please try again.');
        return;
      }

      const session = await signInAccount({ email: data.email, password: data.password });

      if (!session) {
        toast.error('Account created, but sign in failed. Please try signing in manually.');
        return;
      }

      const isLoggedIn = await checkAuthUser();
      if (isLoggedIn) {
        form.reset();
        navigate('/');
        toast.success('Sign up successful! You are now signed in.');
      } else {
        toast.error('Sign up succeeded, but user authentication check failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Sign-up attempt failed:', error);
      let errorMessage = 'Sign up failed. An unexpected error occurred.';
      if (error && typeof error.message === 'string' && error.message.trim() !== '') {
        errorMessage = `Sign up failed: ${error.message}`;
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-950'>
      <Card className='w-full max-w-md shadow-xl'>
        <CardHeader className='space-y-2 text-center'>
          <UserPlus className='mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-500' />
          <CardTitle className='text-3xl font-bold'>Create Account</CardTitle>
          <CardDescription>Join Products Management today.</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <div className='relative'>
                      <User className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
                      <FormControl>
                        <Input placeholder='Your full name' className='pl-9' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <div className='relative'>
                      <AtSign className='text-muted-foreground absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2' />
                      <FormControl>
                        <Input placeholder='Choose a username' className='pl-9' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          className='pl-9'
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
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
                        <Input type='password' placeholder='••••••••' className='pl-9' {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='!mt-6 w-full'
                disabled={isSubmitting || isAuthLoading}
              >
                {isSubmitting || isAuthLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </Form>
          <p className='mt-4 text-center text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <Link
              to='/sign-in'
              className='font-medium text-indigo-600 hover:underline dark:text-indigo-500'
            >
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupForm;
