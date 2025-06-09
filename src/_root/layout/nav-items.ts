import { Home, Package, ShoppingCart, Users, LineChart, Settings } from 'lucide-react';

export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: LineChart },
  { href: '/settings', label: 'Settings', icon: Settings },
];
