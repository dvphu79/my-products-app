import { Link, useLocation } from 'react-router-dom';
import { Package as AppIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './nav-items';

const DesktopSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
      <div className="flex h-14 items-center border-b px-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold"
        >
          <AppIcon className="h-6 w-6 text-primary" />
          <span>Admin Panel</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  location.pathname === item.href && 'bg-muted text-primary font-medium'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default DesktopSidebar;