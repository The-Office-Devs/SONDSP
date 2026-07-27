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
  updateStudentService 
} from "../students.service";
import type { StudentFilter } from "../students.types";
import type { StudentFormData } from "./student.schema";
import type { PaginationParams } from "@/api/types";

const STUDENTS_QUERY_KEY = ['students'] as const;

export function useStudents(filter?: StudentFilter & PaginationParams) {
  return useQuery({
    queryKey: [...STUDENTS_QUERY_KEY, filter],
    queryFn: () => listStudentsService(filter),
    placeholderData: keepPreviousData,
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
        status: data.status
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success('Aluno cadastrado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
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
          status: data.status
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success('Aluno atualizado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useInactivateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      inactivateStudentService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: STUDENTS_QUERY_KEY });
      toast.success(message || 'Status do aluno alterado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}