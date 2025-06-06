import '@/styles/custom.css';
import '@/styles/tailwind.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { QueryProvider } from '@/lib/react-query/QueryProvider';

import App from './App';
import { Toaster } from '@/components/ui/sonner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <App />
          <Toaster richColors position='top-right' /> {/* Add Toaster here */}
        </AuthProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>
);
