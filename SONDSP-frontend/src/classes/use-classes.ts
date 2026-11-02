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
  updateClassService,
  getClassStudentsService,
  getClassMapService,
  getLearningTrajectoryService,
  exportSchoolClassSurveysService
} from "./classes.service";
import type { ClassFilter, ClassStudentsFilter, UseClassesOptions } from "./classes.types";
import type { ClassMapFilter } from "@/class-map/class-map.types";
import type { ClassFormData } from "./classes-page/class.schema";
import type { PaginationParams } from "@/api/types";
import type { LearningTrajectoryFilter } from "@/learning-trajectories/learning-trajectories.types";
import { useAuthStore } from '@/auth/auth.store';
import { useUser } from "@/users/users-page/use-users";
import { ALL_VALUE } from '@/lib/options-utils';

const CLASSES_QUERY_KEY = ['classes'] as const;

export function useClasses(
  filter?: ClassFilter & PaginationParams,
  options?: UseClassesOptions
) {
  return useQuery({
    queryKey: [...CLASSES_QUERY_KEY, filter],
    queryFn: () => listClassesService(filter),
    placeholderData: keepPreviousData,
    ...options
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

export function useClassStudentsCard(
  id: number,
  filter: ClassStudentsFilter | null
) {
  return useQuery({
    queryKey: ["class", id, "students-panel", filter],
    queryFn: () => getClassStudentsService(id, filter as ClassStudentsFilter),
    enabled: !!id && !!filter?.strandId,
    placeholderData: keepPreviousData
  });
}

export function useClassMap(id: number | undefined, filter: ClassMapFilter) {
  return useQuery({
    queryKey: ["class-map", id, filter],
    queryFn: () => getClassMapService(id as number, filter),
    enabled: !!id && !!filter.strandId,
    placeholderData: keepPreviousData,
  });
}

export function useLearningTrajectory(
  id: number | undefined,
  filter: LearningTrajectoryFilter
) {
  return useQuery({
    queryKey: ["class", id, "trajectory", filter],
    queryFn: () => getLearningTrajectoryService(id as number, filter),
    enabled: !!id && !!filter?.strandId,
    placeholderData: keepPreviousData
  });
}

export function useExportSchoolClassSurveys() {
  return useMutation({
    mutationFn: (schoolClassId: number) => exportSchoolClassSurveysService(schoolClassId),

    onMutate: () => {
      const toastId = toast.loading('Gerando relatório...');
      return { toastId };
    },

    onSuccess: (blob, _schoolClassId, context) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sondagens.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Relatório gerado com sucesso.', { id: context?.toastId });
    },

    onError: (error: AxiosError<{ error: string }>, _schoolClassId, context) => {
      toast.dismiss(context?.toastId);
      handleApiError(error || 'Erro ao gerar relatório da turma.');
    }
  });
}

export function useUserClassOptions() {
  const userId = useAuthStore((state) => state.user)?.id;
  const { data: userData, isLoading } = useUser(userId!);
  
  const classOptions = userData?.schoolClasses
    .filter((schoolClass) => schoolClass.status)
    .map((schoolClass) => ({
      value: String(schoolClass.id),
      label: `${schoolClass.name} - ${schoolClass.schoolYear}`,
      schoolYear: schoolClass.schoolYear
    })) ?? [];

  const years = new Set(
    classOptions.map(schoolClass => schoolClass.schoolYear)
    .filter(Boolean)
  );

  const schoolYearOptions = [
    { value: ALL_VALUE, label: "Todos" },
    ...[...years]
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .map((year) => ({ value: year, label: year }))
  ]

  return {
    classOptions,
    schoolYearOptions,
    isLoading
  };
}