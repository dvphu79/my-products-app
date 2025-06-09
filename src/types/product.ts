export interface IProduct {
  $id: string; // Appwrite document ID
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string; // URL of the product image
  imageId?: string; // Appwrite File ID for the image
}
