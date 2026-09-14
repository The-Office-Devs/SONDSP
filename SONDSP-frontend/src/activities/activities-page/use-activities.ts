import {
  useMutation, 
  keepPreviousData,
  useQuery,
  useQueryClient } 
from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { changeActivityStatusService, createActivityService, getActivitiesService, getActivityImageService, getStrandsBySubjectService } from "./activities.service";
import type { ActivityFormData } from "./activity-schema";

const ACTIVITIES_QUERY_KEY = ['activities'] as const;

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityFormData) => 
      createActivityService({
        name: data.name,
        strandId: data.strandId,
        schoolYear: data.schoolYear,
        bimester: data.bimester,
        activityModelFile:  data.activityModelFile
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      toast.success('Modelo de atividade cadastrado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useStrandsBySubject(subjectLabel?: string) {
  return useQuery({
    queryKey: ['strands', subjectLabel],
    queryFn: () => getStrandsBySubjectService(subjectLabel!),
    enabled: !!subjectLabel,
  });
}

export function useActivities(params: { page: number; size: number; search?: string }) {
  return useQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, params],
    queryFn: () => getActivitiesService(params),
    placeholderData: keepPreviousData,
  });
}

export function useChangeActivityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => changeActivityStatusService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      toast.success('Status da atividade alterado com sucesso.');
    },
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useActivityImage(activityId?: number | null) {
  return useQuery({
    queryKey: ['activity-image', activityId],
    queryFn: () => getActivityImageService(activityId!),
    enabled: !!activityId,
    staleTime: 1000 * 60 * 5,
  });
}