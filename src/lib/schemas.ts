// Can be at the top of src/pages/SigninForm.tsx or in src/lib/schemas.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long.' }),
  // Example of more complex password rules (uncomment and adjust as needed):
  // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  // .regex(/[0-9]/, { message: "Password must contain at least one number." })
  // .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character." })
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  username: z.string().min(2, { message: 'Username must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
