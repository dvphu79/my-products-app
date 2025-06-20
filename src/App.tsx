import { Routes, Route } from 'react-router-dom';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';
import { logDev } from '@/lib/utils';
import RootLayout from './_root/RootLayout';
import AuthLayout from './_auth/AuthLayout';
import SignupForm from './_auth/forms/SignupForm'; // Import SignupForm
import SigninForm from './_auth/forms/SigninForm';
import { Home } from '@/_root/pages';
import ProductsPage from './_root/pages/ProductsPage'; // Import ProductsPage
import { ProductsProvider } from './contexts/ProductsContext'; // Import ProductsProvider

const App = () => {
  console.log(`current ENV: ${process.env.NODE_ENV}`);
  logDev('Appwrite Config:', APPWRITE_CONFIG);
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route
            path='/products'
            element={
              <ProductsProvider>
                <ProductsPage />
              </ProductsProvider>
            }
          />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
