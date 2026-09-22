import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '@/auth/auth.store';
import { getMeService } from '@/auth/auth.service';
import type { UserRole } from '@/auth/auth.types';

export function ProtectedRoute() {
  const { token, isAuthenticated, user, setUser, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp && decodedToken.exp * 1000 < Date.now()) {
        logout();
        setIsLoading(false);
        return;
      }
    } catch (error) {
      logout();
      setIsLoading(false);
      return;
    }

    if (!user) {
      setIsLoading(true);
      getMeService()
        .then((userData) => {
          setUser({
            id: userData.id,
            name: userData.name,
            registration: userData.registration,
            email: userData.email,
            role: userData.role as UserRole,
            permissions: userData.permissions,
          });
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token, user, setUser, logout]);

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0a4b93] border-t-transparent" />
      </div>
    );
  }

  return <Outlet />;
}
