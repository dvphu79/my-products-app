import { Link, useLocation } from 'react-router-dom';
import { Menu, Package as AppIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'; // Assuming Shadcn UI component
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming Shadcn UI component
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';
import { useUserContext } from '@/contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const { user, signOut, isAuthenticated } = useUserContext();

  const userInitial = user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
  // Using hex codes for generic light gray background (#F0F0F0) and dark gray text (#333333) for better contrast on placehold.co
  // Sizes match the Avatar components below (h-10 -> 40px, h-9 -> 36px)
  const placeholderUrlMobile = `https://placehold.co/40x40/F0F0F0/333333?text=${userInitial}&font=sans-serif`;
  const placeholderUrlDesktop = `https://placehold.co/36x36/F0F0F0/333333?text=${userInitial}&font=sans-serif`;

  return (
    <header className='bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6'>
      {/* Mobile Menu Trigger and Sheet */}
      <div className='sm:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button size='icon' variant='outline'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex w-[280px] flex-col p-0'>
            <SheetHeader className='border-b'>
              <SheetTitle asChild>
                <div className='flex h-14 items-center px-6'>
                  <Link to='/' className='flex items-center gap-2 font-semibold'>
                    <AppIcon className='text-primary h-6 w-6' />
                    <span>Admin Panel</span>
                  </Link>
                </div>
              </SheetTitle>
              <SheetDescription className='sr-only'>
                Mobile navigation menu with user profile and logout.
              </SheetDescription>
            </SheetHeader>
            {isAuthenticated && (
              <div className='border-b p-4'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10'>
                    {/* Mobile Avatar size */}
                    <AvatarImage
                      src={user.imageUrl || placeholderUrlMobile}
                      alt={user.name || user.email}
                    />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='text-sm font-medium'>{user.name || 'User'}</p>
                    <p className='text-muted-foreground text-xs'>{user.email}</p>
                  </div>
                </div>
                <SheetClose asChild>
                  <Button variant='ghost' className='mt-3 w-full justify-start' onClick={signOut}>
                    <LogOut className='mr-2 h-4 w-4' />
                    Log out
                  </Button>
                </SheetClose>
              </div>
            )}
            <nav className='flex flex-1 flex-col gap-1 overflow-y-auto p-4'>
              {NAV_ITEMS.map((item) => (
                <SheetClose asChild key={item.label}>
                  <Link
                    to={item.href}
                    className={cn(
                      'text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium',
                      location.pathname === item.href && 'bg-accent text-accent-foreground'
                    )}
                  >
                    <item.icon className='h-5 w-5' />
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Optional: Page Title or Breadcrumbs for Desktop */}
      <div className='hidden flex-1 sm:block'>
        {/* You can dynamically set a page title here if needed */}
        {/* Example: <h1 className='text-lg font-semibold'>Dashboard</h1> */}
      </div>

      {/* User Profile Dropdown - Desktop */}
      {isAuthenticated && (
        <div className='ml-auto hidden sm:flex sm:items-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='relative m-1 h-9 w-9 rounded-full'>
                {/* Desktop Avatar size */}
                <Avatar className='m-1 h-9 w-9'>
                  <AvatarImage
                    src={user.imageUrl || placeholderUrlDesktop}
                    alt={user.name || user.email}
                  />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <DropdownMenuLabel className='font-normal'>
                <div className='flex flex-col space-y-1'>
                  <p className='text-sm leading-none font-medium'>{user.name || 'User'}</p>
                  <p className='text-muted-foreground text-xs leading-none'>{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className='cursor-pointer'>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
};

export default Header;
