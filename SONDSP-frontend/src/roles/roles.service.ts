import { api } from "@/api/axios";
import type { GroupedPermissions, Role, RoleFormData } from "./roles.types";

export async function getRolesService(): Promise<Role[]> {
  const response = await api.get<Role[]>('/roles');
  return response.data;
}

export async function getRoleByIdService(id: number): Promise<Role> {
  const response = await api.get<Role>(`/roles/${id}`);
  return response.data;
}

export async function getGroupedPermissionsService(): Promise<GroupedPermissions[]> {
  const response = await api.get<GroupedPermissions[]>('/roles/permissions');
  return response.data;
}

export async function createRoleService(data: RoleFormData): Promise<Role> {
  const response = await api.post<Role>('/roles', data);
  return response.data;
}

export async function updateRoleService(id: number, data: RoleFormData): Promise<Role> {
  const response = await api.put<Role>(`/roles/${id}`, data);
  return response.data;
}

export async function deleteRoleService(id: number): Promise<void> {
  await api.delete(`/roles/${id}`);
}
