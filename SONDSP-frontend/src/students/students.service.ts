import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { 
  CreateStudentRequest, 
  Student, 
  StudentFilter, 
  StudentImportResult, 
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

export async function inactivateStudentService(id: number): Promise<string> {
  const response = await api.patch<string>(`/student/${id}/changeStatus`);
  return response.data;
}

export async function importStudentsService(file: File): Promise<StudentImportResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<StudentImportResult>('/student/import', formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return response.data;
}