import type { Class } from "@/classes/classes.types";

export interface StudentListItem {
  id: number;
  name: string;
  registration: string;
  schoolClass: Class;
  rowNumber: number;
  status: boolean;
}

export type Student = StudentListItem;

export interface StudentFilter {
  search?: string;
  status?: boolean;
}

export interface CreateStudentRequest {
  name: string;
  registration: string;
  schoolClassId: number;
  rowNumber: number;
  status: boolean;
}

export type UpdateStudentRequest = CreateStudentRequest;