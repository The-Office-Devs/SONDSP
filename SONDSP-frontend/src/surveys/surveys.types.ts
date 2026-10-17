import type { ActivityListItem } from "@/activities/activities.types";

export interface SurveyListItem {
  id: number;
  administratorName: string;
  administratorId: number;
  studentName: string;
  applicationPeriod: string;
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
  applicationPeriod?: string;
  status?: boolean;
}

export interface CreateSurveyRequest {
  studentId: number;
  activityModelId: number;
  applicationPeriod: string;
};

export interface FinishSurveyRequest {
  surveyId: number;
  image: File;
  result: string;
  notes?: string; 
}