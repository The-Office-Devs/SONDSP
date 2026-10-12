import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type { ClassNote, ClassNotesFilter, CreateClassNoteRequest, DeleteClassNoteRequest, UpdateClassNoteRequest } from "./class-notes.types";

export async function listClassNotesService(
  classId: number,
  filter?: ClassNotesFilter & PaginationParams
): Promise<PageResponse<ClassNote>> {
  const response = await api.get<PageResponse<ClassNote>>(`/schoolClass/${classId}/annotations`, { params: filter });
  return response.data;
}

export async function createClassNoteService({
  classId,
  text
}: CreateClassNoteRequest): Promise<ClassNote> {
  const response = await api.post<ClassNote>(`/schoolClass/${classId}/annotations`, { text });
  return response.data;
}

export async function updateClassNoteService({
  classId, 
  id,
  text
}: UpdateClassNoteRequest): Promise<ClassNote> {
  const response = await api.put<ClassNote>(`/schoolClass/${classId}/annotations/${id}`, { text });
  return response.data;
}

export async function deleteClassNoteService({
  classId, 
  id
}: DeleteClassNoteRequest) {
  const response = await api.delete(`/schoolClass/${classId}/annotations/${id}`);
  return response.data;
}