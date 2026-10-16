import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { 
  Class, 
  ClassFilter, 
  ClassListItem, 
  ClassStudents,
  ClassStudentsFilter,
  CreateClassRequest,
  UpdateClassRequest 
} from "./classes.types";
import type { ClassMap, ClassMapFilter } from "@/class-map/class-map.types";

export async function listClassesService(
  filter?: ClassFilter & PaginationParams
): Promise<PageResponse<ClassListItem>> {
  const response = await api.get<PageResponse<ClassListItem>>('/schoolClass', { params: filter });
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

export async function inactivateClassService(id: number): Promise<string> {
  const response = await api.patch<string>(`/schoolClass/${id}/changeStatus`);
  return response.data;
}

export async function getClassStudentsService(id: number, filter: ClassStudentsFilter): Promise<ClassStudents[]> {
  const response = await api.get<ClassStudents[]>(`/schoolClass/${id}/students-pannel`, { params: filter });
  return response.data;
}

export async function getClassMapService(id: number, filter: ClassMapFilter): Promise<ClassMap> {
  const response = await api.get<ClassMap>(`/schoolClass/${id}/classMap`, { params: filter });
  return response.data;
}

export async function exportSchoolClassSurveysService(schoolClassId: number): Promise<Blob> {
  const response = await api.get<Blob>(`/schoolClass/report/school-class-surveys/${schoolClassId}`, {
    params: { strandId: 2 },
    responseType: 'blob',
  });
  return response.data;
}