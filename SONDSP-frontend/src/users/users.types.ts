import type { Class } from "@/classes/classes.types";
import type { Role } from "@/roles/roles.types";

export interface User {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: Role;
  permissions: string[];
  schoolClasses: Class[];
}

export interface UserListItem {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: Role;
  status: boolean;
  linked: boolean;
}

export interface UserFilter {
  search?: string;
  status?: boolean;
  roleId?: number;
  schoolClassId?: number;
}

export interface CreateUserRequest {
  name: string;
  registration: string;
  email: string;
  roleId: number;
  permissions?: string[];
}

export type UpdateUserRequest = CreateUserRequest;

export interface LinkSchoolClassRequest {
  schoolClassId: number;
  function: string;
}
