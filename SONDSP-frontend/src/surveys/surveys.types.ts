import type { ActivityListItem } from "@/activities/activities.types";

export interface SurveyListItem {
  id: number;
  administratorName: string;
  administratorId: number;
  studentName: string;
  activity: ActivityListItem;
  result?: string;
  notes?: string;
  surveyImage?: string;
  isDigital?: boolean;
  status: boolean;
};

export type Survey = SurveyListItem;

export interface SurveyFilter {
  search?: string;
  activityname?: string;
  strandName?: string;
  bimester?: string;
  status?: boolean;
}

export interface StartSurveyRequest {
  studentId: number;
  activityModelId: number;
};

export interface FinishSurveyRequest {
  surveyId: number;
  image: File;
  result: string;
  notes?: string; 
}