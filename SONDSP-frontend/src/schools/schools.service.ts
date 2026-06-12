import { api } from '@/api/axios';
import type {
  School,
  CreateSchoolRequest,
  UpdateSchoolRequest,
  SchoolRow,
} from './schools.types';

export async function listSchoolsService(): Promise<SchoolRow[]> {
  const response = await api.get<SchoolRow[]>('/school');
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