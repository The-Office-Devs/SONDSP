import type { School } from "@/schools/schools.types";

export interface ClassListItem {
  id: number;
  name: string;
  school: School;
  gradeLevel: string;
  schoolYear: string;
  shift: string;
  numStudents: string;
  status: boolean;
}

export type Class = ClassListItem;

export interface ClassFilter {
  search?: string;
  status?: boolean;
  hasStudents?: boolean;
  schoolId?: number;
  shift?: string;
  gradeLevel?: string;
  schoolYear?: string;
}

export interface UseClassesOptions {
  enabled?: boolean;
}

export interface CreateClassRequest {
  schoolId: number;
  name: string;
  gradeLevel: string;
  schoolYear: string;
  shift: string;
}

export type UpdateClassRequest = CreateClassRequest;
