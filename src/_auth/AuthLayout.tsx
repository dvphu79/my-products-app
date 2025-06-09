import { Outlet, Navigate } from 'react-router-dom';

import { useUserContext } from '@/contexts/AuthContext';

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className='flex flex-1 flex-col items-center justify-center py-10'>
            <Outlet />
          </section>
        </>
      )}
    </>
  );
};

export default AuthLayout;
