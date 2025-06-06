import { Query } from 'appwrite';
import { APPWRITE_CONFIG, account, databases } from './config';

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
    const session = await account.createEmailPasswordSession(
      APPWRITE_CONFIG.ADMIN_USER_EMAIL,
      APPWRITE_CONFIG.ADMIN_PASSWORD
    );
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
  }
}
