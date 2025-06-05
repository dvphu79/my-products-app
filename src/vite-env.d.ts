// src/vite-env.d.ts

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APPWRITE_ENDPOINT: string;
  readonly VITE_APPWRITE_DATABASE_ID: string;
  readonly VITE_APPWRITE_PROJECT_ID: string;
  readonly VITE_APPWRITE_PRODUCTS_COLLECTION_ID: string;
  readonly VITE_APPWRITE_PRODUCT_IMAGES_BUCKET_ID?: string; // Optional
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
