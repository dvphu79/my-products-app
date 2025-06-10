import { Query, ID } from 'appwrite';
import { APPWRITE_CONFIG, account, databases, storage } from './config';
import { type ProductFormValues, type SignupFormValues } from '@/lib/schemas';
import type { IProduct } from '@/types/product';

// ============================================================
// AUTH
// ============================================================

// ============================== SIGN IN
export async function signInAccount(user: { email: string; password: string }) {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Admin User ID: ${APPWRITE_CONFIG.ADMIN_USER_ID}`);
      console.log(`Admin Password: ${APPWRITE_CONFIG.ADMIN_PASSWORD}`);
      console.log(`Admin Email: ${APPWRITE_CONFIG.ADMIN_USER_EMAIL}`);
      console.log(`email: ${user.email}`);
      console.log(`password: ${user.password}`);
    }
    const session = await account.createEmailPasswordSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET ACCOUNT
export async function getAccount() {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    console.log(error);
  }
}

// ============================== GET USER
export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.USERS_COLLECTION_ID,
      [Query.equal('accountId', currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

// ============================== SIGN OUT
export async function signOutAccount() {
  try {
    const session = await account.deleteSession('current');

    return session;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUserAccount(userData: SignupFormValues) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      userData.name
    );

    if (!newAccount) throw Error('Account creation failed');

    // Ensure your IUser type and database schema accommodate these fields
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: userData.username, // Username from the form
      imageUrl: '',
      bio: '',
    });

    return newUser;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: string;
  username: string;
  bio?: string;
}) {
  try {
    // Ensure appwriteConfig.databaseId and appwriteConfig.userCollectionId are correctly set up
    const newUserDocument = await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.USERS_COLLECTION_ID,
      user.accountId, // Use accountId as document ID for easier lookup
      {
        accountId: user.accountId,
        email: user.email,
        name: user.name,
        username: user.username,
        imageUrl: user.imageUrl,
        bio: user.bio || '',
      }
    );
    return newUserDocument;
  } catch (error) {
    console.error('Error saving user to DB:', error);
    throw error;
  }
}

// ============================== PRODUCTS

/**
 * Creates a new product document in Appwrite.
 * @param productData - The product data from the form.
 * @param imageId - Optional ID of the uploaded image in Appwrite Storage.
 * @returns The newly created product document.
 */
export async function createProductDocument(
  productData: ProductFormValues,
  imageId?: string
): Promise<IProduct> {
  try {
    const dataToSave = {
      name: productData.name,
      category: productData.category,
      price: Number(productData.price),
      stock: Number(productData.stock),
      description: productData.description || '',
      ...(imageId && { imageId: imageId }), // Conditionally add imageId
    };

    const newProduct = await databases.createDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.PRODUCTS_COLLECTION_ID, // Ensure this is defined in your appwriteConfig
      ID.unique(),
      dataToSave
    );
    // Assuming IProduct matches the structure of the document returned by Appwrite
    // You might need to fetch the image URL separately if not storing it directly
    return newProduct as unknown as IProduct;
  } catch (error) {
    console.error('Error creating product document:', error);
    throw error;
  }
}

/**
 * Fetches all products from Appwrite.
 * @returns A list of products.
 */
export async function getAppwriteProducts(): Promise<IProduct[]> {
  try {
    const response = await databases.listDocuments(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.PRODUCTS_COLLECTION_ID, // Ensure this is defined in your appwriteConfig
      [Query.orderDesc('$createdAt')] // Optional: order by creation date
    );

    // Map documents to IProduct, potentially fetching image URLs
    const products = response.documents.map((doc) => {
      let imageUrl;
      if (doc.imageId) {
        try {
          imageUrl = storage.getFileDownload(
            APPWRITE_CONFIG.PRODUCT_IMAGES_BUCKET_ID!,
            doc.imageId as string
          );
        } catch (e) {
          console.warn(`Failed to get preview URL for imageId ${doc.imageId}:`, e);
          imageUrl = undefined; // Or a placeholder URL
        }
      }
      return {
        $id: doc.$id,
        name: doc.name as string,
        category: doc.category as string,
        price: doc.price as number,
        stock: doc.stock as number,
        description: doc.description as string | undefined,
        imageId: doc.imageId as string | undefined,
        imageUrl: imageUrl,
      };
    });

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function updateAppwriteProduct(
  productId: string,
  productData: Partial<
    Omit<
      IProduct,
      '$id' | '$collectionId' | '$databaseId' | '$createdAt' | '$updatedAt' | '$permissions'
    >
  >
): Promise<IProduct | null> {
  try {
    const updatedDocument = await databases.updateDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.PRODUCTS_COLLECTION_ID,
      productId,
      productData
    );
    // The 'updatedDocument' will not have the 'imageUrl' directly from the database.
    // The 'imageUrl' is constructed in the context using the 'imageId'.
    // So, we return the raw document structure from Appwrite.
    return updatedDocument as unknown as IProduct;
  } catch (error) {
    console.error('Appwrite service :: updateAppwriteProduct :: error', error);
    // It's good practice to throw the error or handle it more specifically
    // For now, returning null as per the context's expectation on failure
    return null;
  }
}

export async function deleteAppwriteProduct(productId: string): Promise<boolean> {
  try {
    await databases.deleteDocument(
      APPWRITE_CONFIG.DATABASE_ID,
      APPWRITE_CONFIG.PRODUCTS_COLLECTION_ID,
      productId
    );
    return true;
  } catch (error) {
    console.error('Appwrite service :: deleteAppwriteProduct :: error', error);
    // It's good practice to throw the error or handle it more specifically
    // For now, returning false as per the context's expectation on failure
    return false;
  }
}
