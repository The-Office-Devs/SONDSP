import { 
  useMutation, 
  useQuery, 
  useQueryClient 
} from '@tanstack/react-query';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

import { handleApiError } from '@/lib/utils';
import {
  getRolesService,
  getRoleByIdService,
  getGroupedPermissionsService,
  createRoleService,
  updateRoleService,
  deleteRoleService,
} from '../roles.service';
import type { RoleFormData } from '../roles.types';

const ROLES_QUERY_KEY = ['roles'] as const;
const PERMISSIONS_QUERY_KEY = ['roles', 'permissions'] as const;

export function useRoles() {
  return useQuery({
    queryKey: ROLES_QUERY_KEY,
    queryFn: getRolesService,
  });
}

export function useRole(id: number | null) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => getRoleByIdService(id as number),
    enabled: !!id,
  });
}

export function useGroupedPermissions() {
  return useQuery({
    queryKey: PERMISSIONS_QUERY_KEY,
    queryFn: getGroupedPermissionsService,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RoleFormData) => createRoleService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Função cadastrada com sucesso.');
    },
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error, 'Erro ao cadastrar função.')
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RoleFormData }) =>
      updateRoleService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Função atualizada com sucesso.');
    },
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error, 'Erro ao atualizar função.')
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteRoleService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROLES_QUERY_KEY });
      toast.success('Função excluída com sucesso.');
    },
    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error, 'Erro ao excluir função.')
  });
}
