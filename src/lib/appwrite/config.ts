import { Client, Account, Databases, Storage, ID } from 'appwrite';

// Access environment variables
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Basic validation to ensure variables are loaded
if (!appwriteEndpoint || !appwriteProjectId) {
  console.error('Appwrite environment variables are not set. Please check your .env file.');
  // You might want to throw an error or handle this more gracefully
  // depending on your application's needs.
  // For now, we'll proceed, but the Appwrite client will likely fail to initialize.
}

const client = new Client();

client
  .setEndpoint(appwriteEndpoint || 'DEFAULT_FALLBACK_ENDPOINT_IF_ANY') // Provide a fallback or handle error
  .setProject(appwriteProjectId || 'DEFAULT_FALLBACK_PROJECT_ID_IF_ANY'); // Provide a fallback or handle error

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

// Optional: Export other config values if you store them in .env
export const APPWRITE_CONFIG = {
  ENDPOINT: import.meta.env.VITE_APPWRITE_ENDPOINT,
  PROJECT_ID: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  DATABASE_ID: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  PRODUCTS_COLLECTION_ID: import.meta.env.VITE_APPWRITE_PRODUCTS_COLLECTION_ID,
  PRODUCT_IMAGES_BUCKET_ID: import.meta.env.VITE_APPWRITE_PRODUCT_IMAGES_BUCKET_ID,
};
