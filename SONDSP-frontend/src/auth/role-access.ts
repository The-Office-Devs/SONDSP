import type { AuthUser, UserRole } from "./auth.types";
import { administratorItems, applicationItems, canAccessItem } from "@/lib/sidebar-utils";

export type AppArea = 'admin' | 'application';

export function canAccessByRole(role: UserRole, area: AppArea): boolean {
  if (role === 'Administrador' || role === 'Administrador da Escola') {
    return area === 'admin' || area === 'application';
  }
  return area === 'application';
}

export function canAccess(target: AuthUser | UserRole | null | undefined, area: AppArea): boolean {
  if (!target) return false;

  if (typeof target === 'string') {
    return canAccessByRole(target, area);
  }

  const user = target;
  const isAdmin = user.role === 'Administrador' || (user as any).isAdmin;
  if (isAdmin) return true;

  const permissions = user.permissions || [];

  if (area === 'admin') {
    return administratorItems.some((item) => canAccessItem(item, permissions, false));
  }

  if (area === 'application') {
    return applicationItems.some((item) => canAccessItem(item, permissions, false));
  }

  return false;
}

export function getHomePath(target: AuthUser | UserRole | null | undefined): string {
  if (!target) return '/login';

  if (typeof target === 'string') {
    if (canAccessByRole(target, 'admin')) return '/gerenciamento/usuarios';
    return '/app-turmas';
  }

  const user = target;
  const isAdmin = user.role === 'Administrador' || (user as any).isAdmin;
  const permissions = user.permissions || [];

  if (isAdmin) {
    return '/gerenciamento/usuarios';
  }

  const allowedAppItems = applicationItems.filter((item) => canAccessItem(item, permissions, false));
  const allowedAdminItems = administratorItems.filter((item) => canAccessItem(item, permissions, false));

  if (allowedAppItems.length > 0) {
    return allowedAppItems[0].to;
  }

  if (allowedAdminItems.length > 0) {
    return `/gerenciamento${allowedAdminItems[0].to}`;
  }

  return '/ajuda';
}
