export interface User {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface UserListItem {
  id: number;
  name: string;
  registration: string;
  email: string;
  role: string
  status: boolean;
}

export interface CreateUserRequest {
  name: string;
  registration: string;
  email: string;
  role: string;
  permissions: string[];
}

export type UpdateUserRequest = CreateUserRequest;