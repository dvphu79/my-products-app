import { Outlet } from 'react-router-dom';
import DesktopSidebar from './layout/DesktopSidebar';
import Header from './layout/Header';

const RootLayout = () => {
  return (
    <div className='flex min-h-screen w-full'>
      <DesktopSidebar />
      <div className='flex flex-1 flex-col sm:pl-60'>
        {' '}
        {/* sm:pl-60 matches DesktopSidebar width */}
        <Header />
        <main className='bg-muted/40 flex-1 overflow-x-hidden p-4 pt-20 sm:p-6 sm:pt-6'>
          {/* pt-20 for mobile sticky header, sm:p-6 and sm:pt-6 for static header */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
