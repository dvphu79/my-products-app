import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      {/* You can add common layout elements like Sidebar or Topbar here later */}
      <section className='flex h-full flex-1'>
        {/* Content for authenticated routes will be rendered here */}
        <Outlet />
      </section>
    </div>
  );
};

export default RootLayout;
