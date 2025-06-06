export interface IUser {
  $id?: string; // Appwrite document ID
  accountId: string;
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
}
