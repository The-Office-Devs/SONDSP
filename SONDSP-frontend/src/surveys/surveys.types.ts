export interface SurveyListItem {
  id: number;
  applierId: number;
  studentId: number;
  result?: string;
  notes?: string;
  surveyImageRef?: string;
  isDigital?: boolean;
  status: boolean;
};

export type Survey = SurveyListItem;

export interface StartSurveyRequest {
  studentId: number;
  activityModelId: number;
};