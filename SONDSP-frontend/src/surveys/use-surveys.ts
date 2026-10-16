import { 
  keepPreviousData,
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { 
  deleteSurveyService,
  finishSurveyService, 
  getStudentSurveysService, 
  getSurveyImageService, 
  startSurveyService 
} from "./surveys.service";
import type { StartSurveyRequest, SurveyFilter } from "./surveys.types";
import type { FinishSurveyFormData } from "@/components/Dialog/FinishSurveyDialog";
import type { PaginationParams } from "@/api/types";

const SURVEYS_QUERY_KEY = ['surveys'] as const;

export function useStartSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StartSurveyRequest) => startSurveyService(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success('Sondagem iniciada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao iniciar sondagem.')
  });
}

export function useStudentSurveys(
  studentId: number,
  filter?: SurveyFilter & PaginationParams
) {
  return useQuery({
    queryKey: [...SURVEYS_QUERY_KEY, 'student', studentId, filter],
    queryFn: () => getStudentSurveysService(studentId, filter),
    placeholderData: keepPreviousData
  });
}

export function useFinishSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, data }: { surveyId: number; data: FinishSurveyFormData }) =>
      finishSurveyService({ surveyId, ...data }),
  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success('Sondagem cadastrada com sucesso.');
    },
  
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  }); 
}

export function useDeleteSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSurveyService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success(message || 'Sondagem excluída com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useSurveyImage(surveyId?: number | null) {
  return useQuery({
    queryKey: ['survey-image', surveyId],
    queryFn: () => getSurveyImageService(surveyId!),
    enabled: !!surveyId,
    staleTime: 1000 * 60 * 5,
  });
}