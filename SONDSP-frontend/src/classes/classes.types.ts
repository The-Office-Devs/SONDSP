import type { School } from "@/schools/schools.types";

export interface ClassListItem {
  id: number;
  name: string;
  school: School;
  gradeLevel: string;
  schoolYear: string;
  shift: string;
  status: boolean;
}

export type Class = ClassListItem;

export interface ClassFilter {
  search?: string;
  status?: boolean;
}

export interface CreateClassRequest {
  schoolId: number;
  name: string;
  gradeLevel: string;
  schoolYear: string;
  shift: string;
}

export type UpdateClassRequest = CreateClassRequest;
