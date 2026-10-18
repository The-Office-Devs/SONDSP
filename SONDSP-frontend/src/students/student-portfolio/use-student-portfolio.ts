import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import {
  createStudentAnnotationService,
  deleteStudentAnnotationService,
  getStudentAnnotationsService,
  getStudentPortfolioService,
  getStudentTimelineService,
  updateStudentAnnotationService,
  updateStudentAnnotationTagsService,
  type StudentAnnotationPayload,
} from "./student-portfolio.service";
import type { PaginationParams } from "@/api/types";
import type { AnnotationTag } from "./student-portfolio.types";

export const PORTFOLIO_QUERY_KEYS = {
  all: ["student-portfolio"] as const,
  profile: (studentId: number) =>
    [...PORTFOLIO_QUERY_KEYS.all, "profile", studentId] as const,
  timeline: (studentId: number, strandId?: number) =>
    [
      ...PORTFOLIO_QUERY_KEYS.all,
      "timeline",
      studentId,
      strandId ?? "all",
    ] as const,
  annotations: (studentId: number, tag?: AnnotationTag, pagination?: PaginationParams) =>
    [
      ...PORTFOLIO_QUERY_KEYS.all,
      "annotations",
      studentId,
      tag ?? "all",
      pagination?.page ?? 0,
      pagination?.size ?? 3,
    ] as const,
};

/**
 * Hook para obter dados cadastrais e histórico escolar do estudante.
 */
export function useStudentPortfolio(studentId: number | null) {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.profile(studentId ?? 0),
    queryFn: () => getStudentPortfolioService(studentId!),
    enabled: Boolean(studentId && studentId > 0),
  });
}

/**
 * Hook para obter a linha do tempo longitudinal de sondagens do estudante.
 */
export function useStudentTimeline(studentId: number | null, strandId?: number) {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.timeline(studentId ?? 0, strandId),
    queryFn: () => getStudentTimelineService(studentId!, strandId),
    enabled: Boolean(studentId && studentId > 0),
  });
}

/**
 * Hook para obter anotações pedagógicas/conselho do estudante com paginação.
 */
export function useStudentAnnotations(
  studentId: number | null,
  tag?: AnnotationTag,
  pagination?: PaginationParams
) {
  return useQuery({
    queryKey: PORTFOLIO_QUERY_KEYS.annotations(studentId ?? 0, tag, pagination),
    queryFn: () => getStudentAnnotationsService(studentId!, tag, pagination),
    enabled: Boolean(studentId && studentId > 0),
  });
}

/**
 * Hook para registrar uma nova anotação para o estudante.
 */
export function useCreateStudentAnnotation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentAnnotationPayload) =>
      createStudentAnnotationService(studentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PORTFOLIO_QUERY_KEYS.all, "annotations", studentId],
      });
      toast.success("Anotação registrada com sucesso.");
    },
    onError: (err: AxiosError<{ error: string }>) => {
      handleApiError(err, "Não foi possível registrar a anotação.");
    },
  });
}

/**
 * Hook para editar o conteúdo e tags de uma anotação (apenas autor).
 */
export function useUpdateStudentAnnotation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      annotationId,
      data,
    }: {
      annotationId: number;
      data: StudentAnnotationPayload;
    }) => updateStudentAnnotationService(studentId, annotationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PORTFOLIO_QUERY_KEYS.all, "annotations", studentId],
      });
      toast.success("Anotação atualizada com sucesso.");
    },
    onError: (err: AxiosError<{ error: string }>) => {
      handleApiError(err, "Não foi possível atualizar a anotação.");
    },
  });
}

/**
 * Hook para atualizar rapidamente as tags de uma anotação.
 */
export function useUpdateStudentAnnotationTags(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      annotationId,
      tags,
    }: {
      annotationId: number;
      tags: AnnotationTag[];
    }) =>
      updateStudentAnnotationTagsService(studentId, annotationId, { tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PORTFOLIO_QUERY_KEYS.all, "annotations", studentId],
      });
      toast.success("Categorias atualizadas com sucesso.");
    },
    onError: (err: AxiosError<{ error: string }>) => {
      handleApiError(err, "Não foi possível atualizar as categorias.");
    },
  });
}

/**
 * Hook para excluir uma anotação (apenas autor).
 */
export function useDeleteStudentAnnotation(studentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (annotationId: number) =>
      deleteStudentAnnotationService(studentId, annotationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...PORTFOLIO_QUERY_KEYS.all, "annotations", studentId],
      });
      toast.success("Anotação excluída com sucesso.");
    },
    onError: (err: AxiosError<{ error: string }>) => {
      handleApiError(err, "Não foi possível excluir a anotação.");
    },
  });
}
