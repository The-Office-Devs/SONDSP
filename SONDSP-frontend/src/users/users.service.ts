import { api } from "@/api/axios";
import type { 
  CreateUserRequest,
  UpdateUserRequest,
  User, 
  UserListItem 
} from "./users.types";

export async function listUsersService(): Promise<UserListItem[]> {
  const response = await api.get<UserListItem[]>('/user');
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

export async function deleteUserService(id: number): Promise<void> {
  await api.delete(`/user/${id}`);
}