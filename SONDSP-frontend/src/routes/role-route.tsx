import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/auth/auth.store";
import { canAccess, getHomePath, type AppArea } from "@/auth/role-access";

export function RoleRoute({ area }: { area: AppArea }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  if (!canAccess(user.role, area)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
};

export function HomeRedirect() {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/login" replace />;
  
  return <Navigate to={getHomePath(user.role)} replace />;
}