import { api } from "@/api/axios";
import type { 
  Class, 
  ClassFilter, 
  ClassListItem, 
  CreateClassRequest, 
  UpdateClassRequest 
} from "./classes.types";

export async function listClassesService(filter?: ClassFilter): Promise<ClassListItem[]> {
  const response = await api.get<ClassListItem[]>('/schoolClass', { params: filter });
  return response.data;
}

export async function getClassService(id: number): Promise<ClassListItem> {
  const response = await api.get<Class>(`/schoolClass/${id}`);
  return response.data;
}

export async function createClassService(data: CreateClassRequest): Promise<Class> {
  const response = await api.post<Class>('/schoolClass', data);
  return response.data;
}

export async function updateClassService(id: number, data: UpdateClassRequest): Promise<Class> {
  const response = await api.put<Class>(`/schoolClass/${id}`, data);
  return response.data;
}

export async function deleteClassService(id: number): Promise<void> {
  await api.delete(`/schoolClass/${id}`);
}