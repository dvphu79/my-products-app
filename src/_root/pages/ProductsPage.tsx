import { useState } from 'react';
import { useProducts } from '@/contexts/ProductsContext';
import { type IProduct } from '@/types/product';
import { type ProductFormValues } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, Edit, Trash2, ImageOff } from 'lucide-react';
import { ProductForm } from '@/components/products/ProductForm';
import { DeleteProductDialog } from '@/components/products/DeleteProductDialog';
import { Skeleton } from '@/components/ui/skeleton'; // Assuming Skeleton component exists

const ProductsPage = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const handleAddProduct = () => {
    setCurrentProduct(null);
    setFormMode('add');
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: IProduct) => {
    setCurrentProduct(product);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (product: IProduct) => {
    setCurrentProduct(product);
    setIsAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (currentProduct) {
      await deleteProduct(currentProduct.$id, currentProduct.imageId);
      setIsAlertOpen(false);
      setCurrentProduct(null);
    }
  };

  const handleFormSubmit = async (
    data: ProductFormValues,
    imageFile?: File,
    oldImageId?: string
  ) => {
    if (formMode === 'add') {
      await addProduct(data, imageFile);
    } else if (currentProduct) {
      await updateProduct(currentProduct.$id, data, imageFile, oldImageId);
    }
    // Form closes via its own useEffect on successful submission if no errors
    // setIsFormOpen(false); // Can be removed if form handles its closure
  };

  if (isLoading && products.length === 0) {
    return (
      <div className='space-y-4 p-6'>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-10 w-48' />
          <Skeleton className='h-10 w-32' />
        </div>
        <Skeleton className='h-12 w-full' />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className='h-16 w-full' />
        ))}
      </div>
    );
  }

  return (
    <div className='p-4 sm:p-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Products Management</h1>
        <Button onClick={handleAddProduct} disabled={isLoading}>
          <PlusCircle className='mr-2 h-4 w-4' /> Add New Product
        </Button>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[80px]'>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className='text-right'>Price</TableHead>
              <TableHead className='text-right'>Stock</TableHead>
              <TableHead className='w-[80px] text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.$id}>
                  <TableCell>
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className='h-12 w-12 rounded object-cover'
                      />
                    ) : (
                      <div className='bg-muted flex h-12 w-12 items-center justify-center rounded'>
                        <ImageOff className='text-muted-foreground h-6 w-6' />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className='font-medium'>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className='text-right'>${product.price.toFixed(2)}</TableCell>
                  <TableCell className='text-right'>{product.stock}</TableCell>
                  <TableCell className='text-center'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0' disabled={isLoading}>
                          <span className='sr-only'>Open menu</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() => handleEditProduct(product)}
                          disabled={isLoading}
                        >
                          <Edit className='mr-2 h-4 w-4' /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product)}
                          className='text-destructive focus:text-destructive focus:bg-destructive/10'
                          disabled={isLoading}
                        >
                          <Trash2 className='mr-2 h-4 w-4' /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={currentProduct}
        mode={formMode}
      />
      <DeleteProductDialog
        isOpen={isAlertOpen}
        onOpenChange={setIsAlertOpen}
        onConfirm={confirmDelete}
        productName={currentProduct?.name}
      />
    </div>
  );
};

export default ProductsPage;
