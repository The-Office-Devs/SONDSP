import type { AuthUser } from "./auth.types";
import { administratorItems, applicationItems, canAccessItem } from "@/lib/sidebar-utils";
import type { Role } from "@/roles/roles.types";

export type AppArea = 'admin' | 'application';

export function canAccessByRole(role: Role, area: AppArea): boolean {
  if (role.name === 'Administrador') {
    return area === 'admin' || area === 'application';
  }
  return area === 'application';
}

export function canAccess(target: AuthUser | Role | null | undefined, area: AppArea): boolean {
  if (!target) return false;

  if (typeof target === 'string') {
    return canAccessByRole(target, area);
  }

  const user = target;
  const isAdmin = user.role.isAdmin;
  if (isAdmin) return true;

  const permissions = user?.role?.permissions.map(p => p.permission) || [];

  if (area === 'admin') {
    return administratorItems.some((item) => canAccessItem(item, permissions, false));
  }

  if (area === 'application') {
    return applicationItems.some((item) => canAccessItem(item, permissions, false));
  }

  return false;
}

export function getHomePath(target: AuthUser  | null | undefined): string {
  if (!target) return '/login';

  if (typeof target === 'string') {
    if (canAccessByRole(target, 'admin')) return '/gerenciamento/usuarios';
    return '/app-turmas';
  }

  const user = target;
  const isAdmin = user.role.isAdmin;
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
