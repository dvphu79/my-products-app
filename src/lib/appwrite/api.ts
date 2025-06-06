import { Query, ID } from 'appwrite';
import { APPWRITE_CONFIG, account, databases } from './config';
import { type SignupFormValues } from '@/lib/schemas';

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
