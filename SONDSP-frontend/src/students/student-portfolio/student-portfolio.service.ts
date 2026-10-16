import { api } from "@/api/axios";
import type { PageResponse, PaginationParams } from "@/api/types";
import type {
  AnnotationTag,
  StudentAnnotation,
  StudentPortfolioDTO,
  TimelineSurveyItem,
} from "./student-portfolio.types";

export interface StudentAnnotationPayload {
  text: string;
  tags?: AnnotationTag[];
}

export interface UpdateAnnotationTagsPayload {
  tags: AnnotationTag[];
}

/**
 * Busca dados cadastrais, turma atual e histórico de matrículas do estudante.
 */
export async function getStudentPortfolioService(
  studentId: number
): Promise<StudentPortfolioDTO> {
  const response = await api.get<StudentPortfolioDTO>(`/student/${studentId}/portfolio`);
  return response.data;
}

/**
 * Busca a linha do tempo longitudinal de sondagens do estudante com evolução neutra.
 */
export async function getStudentTimelineService(
  studentId: number,
  strandId?: number
): Promise<TimelineSurveyItem[]> {
  const response = await api.get<TimelineSurveyItem[]>(`/student/${studentId}/timeline`, {
    params: strandId ? { strandId } : undefined,
  });
  return response.data;
}

/**
 * Busca a lista de anotações do estudante, permitindo filtro opcional por tag.
 */
export async function getStudentAnnotationsService(
  studentId: number,
  tag?: AnnotationTag,
  pagination?: PaginationParams
): Promise<PageResponse<StudentAnnotation>> {
  const params: Record<string, unknown> = { ...pagination };
  if (tag && tag !== ("ALL" as unknown)) {
    params.tag = tag;
  }

  const response = await api.get<PageResponse<StudentAnnotation>>(
    `/student/${studentId}/annotations`,
    { params }
  );
  return response.data;
}

/**
 * Cria uma nova anotação pedagógica/conselho para o estudante.
 */
export async function createStudentAnnotationService(
  studentId: number,
  data: StudentAnnotationPayload
): Promise<StudentAnnotation> {
  const response = await api.post<StudentAnnotation>(
    `/student/${studentId}/annotations`,
    data
  );
  return response.data;
}

/**
 * Atualiza o texto e as tags de uma anotação existente (somente o autor).
 */
export async function updateStudentAnnotationService(
  studentId: number,
  annotationId: number,
  data: StudentAnnotationPayload
): Promise<StudentAnnotation> {
  const response = await api.put<StudentAnnotation>(
    `/student/${studentId}/annotations/${annotationId}`,
    data
  );
  return response.data;
}

/**
 * Atualiza rapidamente as tags de uma anotação (aberto à equipe escolar).
 */
export async function updateStudentAnnotationTagsService(
  studentId: number,
  annotationId: number,
  data: UpdateAnnotationTagsPayload
): Promise<StudentAnnotation> {
  const response = await api.patch<StudentAnnotation>(
    `/student/${studentId}/annotations/${annotationId}/tags`,
    data
  );
  return response.data;
}

/**
 * Remove uma anotação do estudante (somente o autor).
 */
export async function deleteStudentAnnotationService(
  studentId: number,
  annotationId: number
): Promise<string> {
  const response = await api.delete<string>(
    `/student/${studentId}/annotations/${annotationId}`
  );
  return response.data;
}
