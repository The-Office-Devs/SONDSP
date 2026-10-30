import type { SchoolWithClass } from "@/schools/schools.types";

export interface User {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: string;
  roles?: string[];
  permissions: string[];
  schools: SchoolWithClass[];
}

export interface UserListItem {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: string;
  roles?: string[];
  status: boolean;
  linked: boolean;
}

export interface UserFilter {
  search?: string;
  status?: boolean;
  roleName?: string;
  schoolId?: number;
  schoolClassId?: number;
}

export interface CreateUserRequest {
  name: string;
  registration: string;
  email: string;
  role?: string;
  roles: string[];
  permissions?: string[];
}

export type UpdateUserRequest = CreateUserRequest;

export interface LinkSchoolRequest {
  schoolId: number;
  function: string;
}

export interface LinkSchoolClassRequest {
  schoolClassId: number;
  function: string;
}
