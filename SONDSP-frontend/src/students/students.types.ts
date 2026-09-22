import type { Class } from "@/classes/classes.types";

export interface StudentListItem {
  id: number;
  name: string;
  registration: string;
  schoolClass?: Class | null;
  schoolName?: Class | null;
  rowNumber?: number | null;
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
  status: boolean;
}

export type UpdateStudentRequest = CreateStudentRequest;