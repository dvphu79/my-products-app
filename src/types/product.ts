export interface IProduct {
  $id?: string; // Appwrite document ID
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women' | 'children'; // Example categories
  imageUrl?: string; // URL of the product image
  imageFileId?: string; // Appwrite File ID for the image
  // Add other relevant fields like SKU, stock, brand, etc.
}
