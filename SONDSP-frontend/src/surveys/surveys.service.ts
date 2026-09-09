import { api } from "@/api/axios";

import type { StartSurveyRequest, Survey } from "./surveys.types";

export async function startSurveyService(data: StartSurveyRequest): Promise<Survey> {
  const response = await api.post<Survey>('/survey', data);
  return response.data; 
};