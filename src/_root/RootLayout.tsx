import { Home } from '@/_root/pages';

const RootLayout = () => {
  return (
    <div className='w-full md:flex'>
      <section className='flex h-full flex-1'>
        <Home />
      </section>
    </div>
  );
};

export default RootLayout;
