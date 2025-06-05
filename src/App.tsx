import { Routes, Route } from 'react-router-dom';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import RootLayout from './_root/RootLayout';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import { Home } from '@/_root/pages';

const App = () => {
  console.log(APPWRITE_CONFIG);
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
