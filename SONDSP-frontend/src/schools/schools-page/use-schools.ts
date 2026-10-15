import { 
  keepPreviousData, 
  useMutation, 
  useQuery, 
  useQueryClient 
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

import { useAuthStore } from '@/auth/auth.store';
import { useUser } from '@/users/users-page/use-users';

import { handleApiError } from '@/lib/utils';
import { listUsersService } from '@/users/users.service';
import {
  listSchoolsService,
  createSchoolService,
  updateSchoolService,
  inactivateSchoolService,
  getSchoolService,
} from '../schools.service';
import type { 
  CreateSchoolRequest, 
  SchoolFilter, 
  UpdateSchoolRequest 
} from '../schools.types';
import type { UserFilter } from '@/users/users.types';
import type { PaginationParams } from '@/api/types';
import { ALL_VALUE } from '@/lib/options-utils';


const SCHOOLS_QUERY_KEY = ['schools'] as const;
const USERS_QUERY_KEY = ['users'] as const;

export function useSchools(filter?: SchoolFilter & PaginationParams) {
  return useQuery({
    queryKey: [...SCHOOLS_QUERY_KEY, filter],
    queryFn: () => listSchoolsService(filter),
    placeholderData: keepPreviousData,
  });
}

export function useSchool(id: number | null) {
  return useQuery({
    queryKey: ["school", id],
    queryFn: () => getSchoolService(id as number),
    enabled: !!id,
  });
}

export function useCreateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSchoolRequest) => createSchoolService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
      toast.success('Escola cadastrada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar escola.')
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolRequest }) =>
      updateSchoolService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
      toast.success('Escola atualizada com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao atualizar escola.')
  });
}

export function useInactivateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => inactivateSchoolService(id),
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
      toast.success(message || 'Status da escola alterado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status da escola.')
  });
}

export function useUsers(filter?: UserFilter & PaginationParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, filter],
    queryFn: () => listUsersService(filter),
    placeholderData: keepPreviousData,
  });
}

export function useUserSchoolOptions(schoolId?: number) {
  const userId = useAuthStore((state) => state.user)?.id;
  const { data: userData, isLoading } = useUser(userId!);
  const schools = userData?.schools ?? [];

  const schoolOptions = schools.map((school) => ({
    value: String(school.id),
    label: school.name
  }));

  const classOptions =
    schools
      .find((school) => school.id === schoolId)
      ?.schoolClass
      .filter((schoolClass) => schoolClass.status)
      .map((schoolClass) => ({
        value: String(schoolClass.id),
        label: `${schoolClass.name} - ${schoolClass.schoolYear}`
      })) ?? [];

  const years = new Set(
    schools
      .flatMap((school) => school.schoolClass ?? [])
      .map((schoolClass) => schoolClass.schoolYear)
      .filter(Boolean)
  );

  const schoolYearOptions = [
      { value: ALL_VALUE, label: "Todos" },
      ...[...years]
        .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
        .map((year) => ({ value: year, label: year }))
    ];

  return { 
    schoolOptions, 
    classOptions, 
    schoolYearOptions, 
    isLoading 
  };
}