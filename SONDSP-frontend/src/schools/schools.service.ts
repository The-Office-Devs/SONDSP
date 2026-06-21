import { api } from '@/api/axios';
import type {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolFilter,
} from './schools.types';

export async function listSchoolsService(filter?: SchoolFilter): Promise<School[]> {
  const response = await api.get<School[]>('/school', { params: filter});
  return response.data;
}

export async function getSchoolService(id: number): Promise<School> {
  const response = await api.get<School>(`/school/${id}`);
  return response.data;
}

export async function createSchoolService(data: CreateSchoolRequest): Promise<School> {
  const response = await api.post<School>('/school', data);
  return response.data;
}

export async function updateSchoolService(id: number, data: UpdateSchoolRequest): Promise<School> {
  const response = await api.put<School>(`/school/${id}`, data);
  return response.data;
}

export async function deleteSchoolService(id: number): Promise<void> {
  await api.delete(`/school/${id}`);
}