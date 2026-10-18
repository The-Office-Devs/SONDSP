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
  createStudentService, 
  inactivateStudentService, 
  getStudentService, 
  listStudentsService, 
  updateStudentService, 
  importStudentsService
} from "../students.service";
import type { StudentFilter, UseStudentsOption } from "../students.types";
import type { StudentFormData } from "./student.schema";
import type { PaginationParams } from "@/api/types";

const STUDENTS_QUERY_KEY = ['students'] as const;

export function useStudents(
  filter?: StudentFilter & PaginationParams,
  options?: UseStudentsOption
) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, filter],
    queryFn: () => listStudentsService(filter),
    placeholderData: keepPreviousData,
    ...options
  });
}

export function useStudent(id: number | null) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudentService(id as number),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentFormData) => 
      createStudentService({
        name: data.name,
        schoolClassId: data.schoolClassId,
        rowNumber: data.rowNumber,
        registration: data.registration,
        birthDate: data.birthDate,
        status: data.status
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success('Aluno cadastrado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar aluno.')
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudentFormData }) =>
      updateStudentService(
        id, 
        {
          name: data.name,
          schoolClassId: data.schoolClassId,
          rowNumber: data.rowNumber,
          registration: data.registration,
          birthDate: data.birthDate,
          status: data.status
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success('Aluno atualizado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao atualizar aluno.')
  });
}

export function useInactivateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      inactivateStudentService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success(message || 'Status do aluno alterado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status do aluno.')
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importStudentsService(file),

    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['classes'] });

      const details = [
        `${result.created} criado(s)`,
        `${result.updated} atualizado(s)`,
        `${result.unlinked} desvinculado(s)`,
        ...(result.ignored > 0 ? [`${result.ignored} ignorado(s)`] : [])
      ].join(", ");

      toast.success(
        `${result.classCreated ? "Turma criada e alunos importados" : "Alunos importados"}: ` +
        `${result.className} - ${result.schoolName}.`,
        { description: details }
      );
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao importar alunos.')
  });
}