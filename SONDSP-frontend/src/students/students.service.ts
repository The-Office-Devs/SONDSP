import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { 
  CreateStudentRequest, 
  Student, 
  StudentFilter, 
  StudentListItem, 
  UpdateStudentRequest 
} from "./students.types";

export async function listStudentsService(
  filter?: StudentFilter & PaginationParams
): Promise<PageResponse<StudentListItem>> {
  const response = await api.get<PageResponse<StudentListItem>>('/student', { params: filter });
  return response.data;
}

export async function getStudentService(id: number): Promise<StudentListItem> {
  const response = await api.get<Student>(`/student/${id}`);
  return response.data;
}

export async function createStudentService(data: CreateStudentRequest): Promise<Student> {
  const response = await api.post<Student>('/student', data);
  return response.data;
}

export async function updateStudentService(id: number, data: UpdateStudentRequest): Promise<Student> {
  const response = await api.put<Student>(`/student/${id}`, data);
  return response.data;
}

export async function deleteStudentService(id: number): Promise<void> {
  await api.delete(`/student/${id}`);
}