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
  createClassService, 
  inactivateClassService, 
  getClassService, 
  listClassesService, 
  updateClassService 
} from "../classes.service";
import type { ClassFilter } from "../classes.types";
import type { ClassFormData } from "./class.schema";
import type { PaginationParams } from "@/api/types";

const CLASSES_QUERY_KEY = ['classes'] as const;

export function useClasses(filter?: ClassFilter & PaginationParams) {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, filter],
    queryFn: () => listClassesService(filter),
    placeholderData: keepPreviousData,
  });
}

export function useClass(id: number | null) {
  return useQuery({
    queryKey: ["class", id],
    queryFn: () => getClassService(id as number),
    enabled: !!id,
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ClassFormData) => 
      createClassService({
        schoolId: data.schoolId,
        name: data.name,
        gradeLevel: data.gradeLevel,
        schoolYear: data.schoolYear,
        shift: data.shift
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY });
      toast.success('Turma cadastrada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar turma.')
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClassFormData }) =>
      updateClassService(
        id, 
        {
          schoolId: data.schoolId,
          name: data.name,
          gradeLevel: data.gradeLevel,
          schoolYear: data.schoolYear,
          shift: data.shift
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY });
      toast.success('Turma atualizada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao atualizar turma.')
  });
}

export function useInactivateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      inactivateClassService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: CLASSES_QUERY_KEY });
      toast.success(message || 'Status da turma alterado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status da turma.')
  });
}