import { api } from "@/api/axios";

import type { ActivityFilter, ActivityListItem, CreateActivityRequest } from "./activities.types";
import type { Strand } from "@/strands/strands.types";
import type { PageResponse, PaginationParams } from "@/api/types";

export async function getActivitiesService(
  filter?: ActivityFilter & PaginationParams
): Promise<PageResponse<ActivityListItem>> {
  const response = await api.get<PageResponse<ActivityListItem>>('/activity', { params: filter });
  return response.data;
}

export async function getStrandsBySubjectService(subject: string) {
  const response = await api.get<Strand[]>('/strand/strands-by-subject', {
    params: { subject }
  });
  return response.data;
}

export async function createActivityService(data: CreateActivityRequest) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("strandId", String(data.strandId));
  formData.append("schoolYear", data.schoolYear);
  formData.append("bimester", data.bimester); 

  if (data.activityModelFile) {
    formData.append("activityModelFile", data.activityModelFile);
  }

  const response = await api.post('/activity', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function inactivateActivityService(id: number) {
  const response = await api.put(`/activity/${id}`);
  return response.data;
}

export async function getActivityImageService(id: number): Promise<Blob> {
  const response = await api.get(`/activity/get-activity-image/${id}`, {
    responseType: 'blob',
  });
  return response.data;
}