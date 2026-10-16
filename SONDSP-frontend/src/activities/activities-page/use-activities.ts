import {
  useMutation, 
  keepPreviousData,
  useQuery,
  useQueryClient } 
from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { 
  createActivityService, 
  getActivitiesService, 
  getActivityImageService, 
  getStrandsBySubjectService, 
  inactivateActivityService
} from "../activities.service";
import type { ActivityFilter, UseActivitiesOption } from "../activities.types";
import type { ActivityFormData } from "./activity-schema";
import type { PaginationParams } from "@/api/types";

const ACTIVITIES_QUERY_KEY = ['activities'] as const;

export function useActivities(
  filter?: ActivityFilter & PaginationParams,
  options?: UseActivitiesOption
) {
  return useQuery({
    queryKey: [...ACTIVITIES_QUERY_KEY, filter],
    queryFn: () => getActivitiesService(filter),
    placeholderData: keepPreviousData,
    ...options
  });
}

export function useStrandsBySubject(subjectLabel?: string) {
  return useQuery({
    queryKey: ['strands', subjectLabel],
    queryFn: () => getStrandsBySubjectService(subjectLabel!),
    enabled: !!subjectLabel,
    staleTime: 5 * 60 * 1000
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ActivityFormData) => 
      createActivityService({
        name: data.name,
        strandId: data.strandId,
        gradeLevel: data.gradeLevel,
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

export function useInactivateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inactivateActivityService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY });
      toast.success('Status do modelo de atividade alterado com sucesso.');
    },
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status do modelo de atividade.')
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