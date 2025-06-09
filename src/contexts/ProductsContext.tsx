import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import { type IProduct } from '@/types/product';
import { type ProductFormValues } from '@/lib/schemas';
import {
  createProductDocument,
  getAppwriteProducts,
  // updateAppwriteProduct, // We'll implement this later
  // deleteAppwriteProduct, // We'll implement this later
} from '@/lib/appwrite/api'; // Assuming you have these Appwrite API functions
import { storage } from '@/lib/appwrite/config'; // For image uploads
import { ID } from 'appwrite';
import { APPWRITE_CONFIG } from '@/lib/appwrite/config';

interface ProductsContextType {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (productData: ProductFormValues, imageFile?: File) => Promise<IProduct | null>;
  updateProduct: (
    productId: string,
    productData: ProductFormValues,
    imageFile?: File,
    oldImageId?: string
  ) => Promise<IProduct | null>;
  deleteProduct: (productId: string, imageId?: string) => Promise<boolean>;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedProducts = await getAppwriteProducts();
      setProducts(fetchedProducts);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.message || 'Failed to fetch products.');
      toast.error('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (
    productData: ProductFormValues,
    imageFile?: File
  ): Promise<IProduct | null> => {
    setIsLoading(true);
    setError(null);
    try {
      let uploadedImageId: string | undefined;
      let uploadedImageUrl: string | undefined;

      if (imageFile) {
        // 1. Upload image to Appwrite Storage
        const uploadedFile = await storage.createFile(
          APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!, // Your bucket ID for product images
          ID.unique(),
          imageFile
        );
        uploadedImageId = uploadedFile.$id;
        uploadedImageUrl = storage.getFilePreview(
          APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!,
          uploadedImageId
        );
      }

      // 2. Create product document in Appwrite Database
      const newProductDocument = await createProductDocument(productData, uploadedImageId);

      // 3. Update local state
      const productWithImageUrl = { ...newProductDocument, imageUrl: uploadedImageUrl };
      setProducts((prev) => [productWithImageUrl, ...prev]);
      toast.success('Product added successfully!');
      return productWithImageUrl;
    } catch (err: any) {
      console.error('Failed to add product:', err);
      setError(err.message || 'Failed to add product.');
      toast.error(err.message || 'Failed to add product.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (
    productId: string,
    productData: ProductFormValues,
    imageFile?: File,
    oldImageId?: string
  ): Promise<IProduct | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // const updatedProduct = await updateAppwriteProduct(productId, productData, imageFile, oldImageId); // Placeholder
      // Mocked implementation:
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedProduct: IProduct = {
        $id: productId,
        ...productData,
        price: Number(productData.price),
        stock: Number(productData.stock),
        imageUrl: imageFile
          ? URL.createObjectURL(imageFile)
          : products.find((p) => p.$id === productId)?.imageUrl,
        imageId: imageFile ? 'updated-img-' + Math.random().toString(36).substr(2, 5) : oldImageId,
      };
      setProducts((prev) => prev.map((p) => (p.$id === productId ? updatedProduct : p)));
      toast.success('Product updated successfully!');
      return updatedProduct;
    } catch (err: any) {
      console.error('Failed to update product:', err);
      setError(err.message || 'Failed to update product.');
      toast.error(err.message || 'Failed to update product.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (productId: string, imageId?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`imageId: ${imageId}`);
      // await deleteAppwriteProduct(productId, imageId); // Placeholder
      // Mocked implementation:
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts((prev) => prev.filter((p) => p.$id !== productId));
      toast.success('Product deleted successfully!');
      return true;
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      setError(err.message || 'Failed to delete product.');
      toast.error(err.message || 'Failed to delete product.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
};
