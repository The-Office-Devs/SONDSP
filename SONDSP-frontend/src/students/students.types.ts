import type { Class } from "@/classes/classes.types";

export interface StudentListItem {
  id: number;
  name: string;
  registration: string;
  schoolClass?: Class | null;
  rowNumber?: number | null;
  birthDate?: string | null;
  classEntryDate?: string | null;
  status: boolean;
}

export type Student = StudentListItem;

export interface StudentFilter {
  search?: string;
  status?: boolean;
  schoolClassId?: number;
}

export interface UseStudentsOption {
  enabled?: boolean;
}

export interface CreateStudentRequest {
  name: string;
  registration: string;
  schoolClassId: number;
  rowNumber: number;
  birthDate: string;
  status: boolean;
}

export type UpdateStudentRequest = CreateStudentRequest;

export interface StudentImportResult {
  className: string;
  classCreated: boolean;
  created: number;
  updated: number;
  unlinked: number;
  ignored: number;
}