import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Users, ShoppingCart, Package } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock data for recent products - replace with actual data fetching
const recentProducts = [
  { id: '1', name: 'Wireless Mouse', category: 'Electronics', stock: 150, price: '$25.99' },
  { id: '2', name: 'Ergonomic Keyboard', category: 'Electronics', stock: 75, price: '$79.00' },
  { id: '3', name: 'Coffee Maker', category: 'Home Goods', stock: 200, price: '$45.50' },
  { id: '4', name: 'Desk Lamp', category: 'Office', stock: 90, price: '$19.99' },
  { id: '5', name: 'Notebook Set', category: 'Stationery', stock: 300, price: '$12.00' },
];

const Home = () => {
  // Previous sign-out logic and user loading can be integrated into the Header's user menu later.
  // For now, focusing on the dashboard layout.

  return (
    <div className='flex flex-1 flex-col gap-6'>
      {/* Header Section with Title */}
      <div className='flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center'>
        <div>
          <h1 className='text-2xl font-semibold md:text-3xl'>Dashboard</h1>
          <p className='text-muted-foreground text-sm'>
            Overview of your store's performance and recent activity.
          </p>
        </div>
        {/* Optional: Action buttons like "Export Data" or "Add New Product" can go here */}
        {/* <div className="flex items-center gap-2">
          <Button variant="outline">Export Data</Button>
          <Button>Add New Product</Button>
        </div> */}
      </div>

      {/* Stat Cards Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>$45,231.89</div>
            <p className='text-muted-foreground text-xs'>+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>New Customers</CardTitle>
            <Users className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+2350</div>
            <p className='text-muted-foreground text-xs'>+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Orders</CardTitle>
            <ShoppingCart className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>+12,234</div>
            <p className='text-muted-foreground text-xs'>+19% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Products</CardTitle>
            <Package className='text-muted-foreground h-4 w-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>573</div>
            <p className='text-muted-foreground text-xs'>+2 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area with Chart and Table */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        {/* Sales Data Chart Placeholder */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              A chart showing sales trends over the past few months.
            </CardDescription>
          </CardHeader>
          <CardContent className='bg-muted/50 flex h-[350px] items-center justify-center rounded-md'>
            <p className='text-muted-foreground'>Sales Chart Placeholder</p>
          </CardContent>
        </Card>

        {/* Recent Products Table */}
        <Card className='lg:col-span-1'>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Top 5 recently added or updated products.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className='hidden sm:table-cell'>Category</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className='font-medium'>{product.name}</div>
                      <div className='text-muted-foreground hidden text-sm md:inline'>
                        Stock: {product.stock}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>{product.category}</TableCell>
                    <TableCell className='text-right'>{product.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
