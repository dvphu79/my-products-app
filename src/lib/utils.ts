import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Util to check if the current environment is development
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Utility function to log information only in the development environment
export const logDev = (...args: unknown[]): void => {
  if (IS_DEVELOPMENT) {
    console.log('[DEV_INFO]', ...args);
  }
};
