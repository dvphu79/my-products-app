export interface IUser {
  $id?: string; // Appwrite document ID
  name: string;
  username: string;
  email: string;
  imageUrl: string;
  bio: string;
}
