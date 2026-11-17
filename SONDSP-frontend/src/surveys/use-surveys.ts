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
  closeDigitalSurveyService,
  createSurveyService,
  deleteSurveyService,
  finishSurveyService, 
  getStudentSurveysService, 
  getSurveyImageService,
  getSurveyService,
  startDigitalSurveyService,
  updateSurveyResponseService
} from "./surveys.service";
import type { CreateSurveyRequest, SurveyFilter, SurveyListItem } from "./surveys.types";
import type { FinishSurveyFormData } from "@/components/Dialog/FinishSurveyDialog";
import type { PaginationParams } from "@/api/types";

const SURVEYS_QUERY_KEY = ['surveys'] as const;
export const digitalSurveyQueryKey = (surveyId: number) => ["surveys", "digital", surveyId] as const;

export function useCreateSurvey() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSurveyRequest) => createSurveyService(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success('Sondagem criada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao criar sondagem.')
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

export function useStartDigitalSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (surveyId: number) => startDigitalSurveyService(surveyId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY }),
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || "Não foi possível iniciar a sondagem digital")
  });
}

export function useFinishDigitalSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (surveyId: number) => closeDigitalSurveyService(surveyId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SURVEYS_QUERY_KEY });
      toast.success("Sondagem digital finalizada");
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || "Não foi possível finalizar a sondagem digital")
  });
}

export function isSurveyLocked(survey?: SurveyListItem) {
  return !!survey && (survey.isClosed === true || survey.status);
}

export function useDigitalSurvey(surveyId: number) {
  return useQuery({
    queryKey: digitalSurveyQueryKey(surveyId),
    queryFn: () => getSurveyService(surveyId),
    enabled: Number.isFinite(surveyId),
    refetchInterval: (query) => (isSurveyLocked(query.state.data) ? false : 10_000)
  });
}

export function useUpdateSurveyResponse() {
  return useMutation({
    mutationFn: ({ surveyId, response }: { surveyId: number; response: string }) =>
      updateSurveyResponseService(surveyId, response)
  });
}