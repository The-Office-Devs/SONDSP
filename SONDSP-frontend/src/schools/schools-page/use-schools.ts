import { 
  keepPreviousData, 
  useMutation, 
  useQuery, 
  useQueryClient 
} from '@tanstack/react-query';
import { toast } from 'sonner';

import { listUsersService } from '@/users/users.service';
import {
  listSchoolsService,
  createSchoolService,
  updateSchoolService,
  deleteSchoolService,
  getSchoolService,
} from '../schools.service';
import type { 
  CreateSchoolRequest, 
  SchoolFilter, 
  UpdateSchoolRequest 
} from '../schools.types';
import type { UserFilter } from '@/users/users.types';
import type { PaginationParams } from '@/api/types';


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
      toast.success('Escola cadastrada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao cadastrar escola.');
    },
  });
}

export function useUpdateSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSchoolRequest }) =>
      updateSchoolService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
      toast.success('Escola atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar escola.');
    },
  });
}

export function useDeleteSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteSchoolService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHOOLS_QUERY_KEY });
      toast.success('Escola excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir escola.');
    },
  });
}

export function useUsers(filter?: UserFilter & PaginationParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, filter],
    queryFn: () => listUsersService(filter),
    placeholderData: keepPreviousData,
  });
}