import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { 
  CreateUserRequest,
  UpdateUserRequest,
  User, 
  UserFilter, 
  UserListItem 
} from "./users.types";

export async function listUsersService(
  filter?: UserFilter & PaginationParams
): Promise<PageResponse<UserListItem>> {
  const response = await api.get<PageResponse<UserListItem>>('/user', { params: filter });
  return response.data;
}

export async function getUserService(id: number): Promise<User> {
  const response = await api.get<User>(`/user/${id}`);
  return response.data;
}

export async function createUserService(data: CreateUserRequest): Promise<User> {
  const response = await api.post<User>('/user', data);
  return response.data;
}

export async function updateUserService(id: number, data: UpdateUserRequest): Promise<User> {
  const response = await api.put<User>(`/user/${id}`, data);
  return response.data;
}

export async function changeUserStatusService(id: number): Promise<string> {
  const response = await api.patch<string>(`/user/${id}/changeStatus`);
  return response.data;
}