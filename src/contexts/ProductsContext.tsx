import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { toast } from 'sonner';
import { type IProduct } from '@/types/product';
import { type ProductFormValues } from '@/lib/schemas';
import {
  createProductDocument,
  getAppwriteProducts,
  updateAppwriteProduct,
  deleteAppwriteProduct,
} from '@/lib/appwrite/api';
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
        uploadedImageUrl = storage.getFileDownload(
          APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!,
          uploadedImageId
        );
      }

      // 2. Create product document in Appwrite Database
      const newProductDocument = await createProductDocument(
        productData,
        uploadedImageId,
        uploadedImageUrl?.toString() // Pass the full URL to be saved
      );

      // 3. Update local state
      // Assuming newProductDocument from createProductDocument now includes the imageUrl
      setProducts((prev) => [newProductDocument, ...prev]);
      toast.success('Product added successfully!');
      return newProductDocument;
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
      let imageIdToSave = oldImageId;
      let newImageUrl: string | undefined;

      const currentProduct = products.find((p) => p.$id === productId);
      newImageUrl = currentProduct?.imageUrl;

      if (imageFile) {
        // If there's an old image, delete it first
        if (oldImageId) {
          try {
            await storage.deleteFile(APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!, oldImageId);
          } catch (e: any) {
            console.warn(`Failed to delete old image ${oldImageId}: ${e.message}`);
            // Non-critical, proceed with uploading new image
          }
        }

        // Upload new image
        const uploadedFile = await storage.createFile(
          APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!,
          ID.unique(),
          imageFile
        );
        imageIdToSave = uploadedFile.$id;
        newImageUrl = storage
          .getFileDownload(APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!, imageIdToSave)
          .toString();
      }

      // Prepare data for the database, excluding the FileList 'image' property
      const { image, ...dataToSave } = productData;
      const payloadForDB = {
        ...dataToSave,
        price: Number(productData.price),
        stock: Number(productData.stock),
        imageId: imageIdToSave,
        imageUrl: newImageUrl?.toString(), // Add imageUrl to the payload for DB
      };

      // Call the (placeholder) API function to update the document in Appwrite DB
      // This function should return the updated document from Appwrite
      const updatedDocument = await updateAppwriteProduct(productId, payloadForDB);

      if (updatedDocument) {
        // Assuming updatedDocument from updateAppwriteProduct now includes the imageUrl
        setProducts((prev) => prev.map((p) => (p.$id === productId ? updatedDocument : p)));
        toast.success('Product updated successfully!');
        return updatedDocument;
      } else {
        toast.error('Failed to update product: No response from server.');
        return null;
      }
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
      // 1. Delete the image from Appwrite Storage if it exists
      if (imageId) {
        try {
          await storage.deleteFile(APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!, imageId);
        } catch (e: any) {
          console.error(`Failed to delete image ${imageId}: ${e.message}`);
          toast.error(`Failed to delete product image. Error: ${e.message}. Aborting delete.`);
          // As per spec, if image deletion fails, abort product deletion.
          return false;
        }
      }

      // 2. Delete the product document from Appwrite Database
      // This (placeholder) function should handle the actual DB deletion and return true/false
      const isDeleted = await deleteAppwriteProduct(productId);

      if (isDeleted) {
        setProducts((prev) => prev.filter((p) => p.$id !== productId));
        toast.success('Product deleted successfully!');
        return true;
      } else {
        toast.error('Failed to delete product from database.');
        return false;
      }
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
