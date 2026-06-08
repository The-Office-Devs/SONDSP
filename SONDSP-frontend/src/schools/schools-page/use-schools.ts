import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  listSchoolsService,
  createSchoolService,
  updateSchoolService,
  deleteSchoolService,
} from '../schools.service';
import { listUsersService } from '@/users/users.service';
import type { CreateSchoolRequest, UpdateSchoolRequest } from '../schools.types';

const SCHOOLS_QUERY_KEY = ['schools'] as const;
const USERS_QUERY_KEY = ['users'] as const;

export function useSchools() {
  return useQuery({
    queryKey: SCHOOLS_QUERY_KEY,
    queryFn: listSchoolsService,
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

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: listUsersService,
  });
}
