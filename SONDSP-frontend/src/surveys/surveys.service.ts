import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";

import type { 
  CreateSurveyRequest,
  FinishSurveyRequest, 
  Survey, 
  SurveyFilter, 
  SurveyListItem
} from "./surveys.types";

export async function createSurveyService(data: CreateSurveyRequest): Promise<Survey> {
  const response = await api.post<Survey>('/survey', data);
  return response.data; 
};

export async function getSurveyService(surveyId: number) {
  const response = await api.get<SurveyListItem>(`/survey/${surveyId}`);
  return response.data;
}

export async function getStudentSurveysService(
  id: number,
  filter?: SurveyFilter & PaginationParams
): Promise<PageResponse<SurveyListItem>> {
  const response = await api.get<PageResponse<SurveyListItem>>(`/survey/student-surveys/${id}`, { params: filter });
  return response.data; 
}

export async function finishSurveyService(data: FinishSurveyRequest) {
  const formData = new FormData();

  formData.append("result", data.result);

  if (data.notes) {
    formData.append("notes", data.notes);
  } 

  if (data.image) {
    formData.append("image", data.image);
  }

  const response = await api.put(`/survey/${data.surveyId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function deleteSurveyService(id: number) {
  const response = await api.delete(`/survey/${id}`);
  return response.data;
}

export async function getSurveyImageService(id: number): Promise<string> {
  const response = await api.get<{ imageUrl: string }>(`/survey/get-survey-image/${id}`);
  return response.data.imageUrl;
}

export interface SurveyResultOption {
  value: string;
  label: string;
  category?: string;
}

export async function getSurveyResultOptionsService(
  activityId?: number,
  strandCode?: string,
  gradeLevel?: string
): Promise<SurveyResultOption[]> {
  if (activityId) {
    const response = await api.get<SurveyResultOption[]>(
      `/survey/activity/${activityId}/result-options`
    );
    return response.data;
  }

  const response = await api.get<SurveyResultOption[]>(
    `/survey/result-options`,
    { params: { strandCode, gradeLevel } }
  );
  return response.data;
}

export async function startDigitalSurveyService(surveyId: number) {
  const response = await api.patch(`/survey/${surveyId}/startSurveyAsDigital`);
  return response.data;
}

export async function closeDigitalSurveyService(surveyId: number) {
  const response = await api.patch(`/survey/${surveyId}/closeDigitalSurvey`);
  return response.data;
}

export async function updateSurveyResponseService(surveyId: number, response: string) {
  await api.patch(`/survey/${surveyId}/updateResponse`, { response });
}