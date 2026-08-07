'use client';

import { useEffect } from 'react';
import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const initAuth = async () => {
      const { setUser, clearIsAuthenticated } = useAuthStore.getState();

      try {
        const session = await checkSession();
        if (session) {
          const userData = await getMe();
          setUser(userData);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
}