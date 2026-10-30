export interface Permission {
  id: number;
  permission: string;
  description: string;
  area: string;
}

export interface GroupedPermissions {
  area: string;
  permissions: Permission[];
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  isAdmin: boolean;
  userCount: number;
}

export interface RoleFormData {
  name: string;
  permissionIds: number[];
}
