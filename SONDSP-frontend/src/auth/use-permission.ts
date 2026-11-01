import { useAuthStore } from './auth.store';

export function useHasPermission(permission: string | string[]): boolean {
  const user = useAuthStore((state) => state.user);

  if (!user) return false;

  // Administrador Geral do Sistema possui todas as permissões irrestritas
  if (user.role === 'Administrador' || (user as any).isAdmin) {
    return true;
  }

  const userPermissions = user.permissions || [];

  if (Array.isArray(permission)) {
    return permission.some((p) => userPermissions.includes(p));
  }

  return userPermissions.includes(permission);
}

export function hasPermission(
  userPermissions: string[] | undefined,
  permission: string | string[],
  isAdmin = false
): boolean {
  if (isAdmin) return true;
  if (!userPermissions) return false;

  if (Array.isArray(permission)) {
    return permission.some((p) => userPermissions.includes(p));
  }

  return userPermissions.includes(permission);
}
