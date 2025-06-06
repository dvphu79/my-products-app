import { useNavigate } from 'react-router-dom';
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import { type IUser } from '@/types/user';
import { getAccount } from '@/lib/appwrite/api';

export const INITIAL_USER = {
  $id: '',
  name: '',
  username: '',
  email: '',
  imageUrl: '',
  bio: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: true, // Align with AuthProvider's initial isLoading state
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start true for initial auth check

  const checkAuthUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentAccount = await getAccount();
      if (currentAccount) {
        setUser({
          $id: currentAccount.$id || '',
          name: currentAccount.name || '',
          username: currentAccount.email || '',
          email: currentAccount.email || '',
          imageUrl: '',
          bio: '',
        });
        setIsAuthenticated(true);
        return true;
      }
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error(error);
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []); // Dependencies: setUser, setIsAuthenticated, setIsLoading are stable. INITIAL_USER is constant.

  useEffect(() => {
    const performInitialAuthCheck = async () => {
      const cookieFallback = localStorage.getItem('cookieFallback');
      if (cookieFallback === '[]' || cookieFallback === null || cookieFallback === undefined) {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        setIsLoading(false);
        // Avoid navigation loops if already on auth pages
        if (window.location.pathname !== '/sign-in' && window.location.pathname !== '/sign-up') {
          navigate('/sign-in');
        }
      } else {
        await checkAuthUser();
      }
    };
    performInitialAuthCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkAuthUser, navigate]); // checkAuthUser is memoized, navigate is from react-router (stable)

  const value = useMemo(
    () => ({
      user,
      setUser,
      isLoading,
      isAuthenticated,
      setIsAuthenticated,
      checkAuthUser,
    }),
    [user, isLoading, isAuthenticated, checkAuthUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
