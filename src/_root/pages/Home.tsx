import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useUserContext, INITIAL_USER } from '@/context/AuthContext';
import { signOutAccount } from '@/lib/appwrite/api';
import { Loader2 } from 'lucide-react'; // For a loading spinner

const Home = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsAuthenticated, isLoading: isAuthLoading } = useUserContext();

  const handleSignOut = async () => {
    try {
      await signOutAccount();
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      navigate('/sign-in');
      toast.success('Signed out successfully!');
    } catch (error) {
      console.error('Sign out failed:', error);
      toast.error('Sign out failed. Please try again.');
    }
  };

  if (isAuthLoading) {
    return (
      <div className='flex h-full flex-1 flex-col items-center justify-center space-y-4 p-4'>
        <Loader2 className='h-12 w-12 animate-spin text-indigo-600' />
        <p className='text-lg text-gray-600 dark:text-gray-400'>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className='flex h-full flex-1 flex-col items-center justify-center space-y-6 p-6 text-center'>
      <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100'>Welcome Back!</h1>
      {user.email ? (
        <p className='text-xl text-gray-700 dark:text-gray-300'>
          You are signed in as:{' '}
          <span className='font-semibold text-indigo-600 dark:text-indigo-400'>{user.email}</span>
        </p>
      ) : (
        <p className='text-xl text-gray-500 dark:text-gray-400'>User email not available.</p>
      )}
      <Button
        onClick={handleSignOut}
        variant='destructive'
        size='lg'
        className='w-full max-w-xs py-3 text-base'
      >
        Sign Out
      </Button>
    </div>
  );
};

export default Home;
