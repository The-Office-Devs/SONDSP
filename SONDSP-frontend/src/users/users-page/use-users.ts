import { 
  keepPreviousData, 
  useMutation, 
  useQuery, 
  useQueryClient 
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { useAuthStore } from "@/auth/auth.store";
import { UserRole } from "@/auth/auth.types";
import { 
  createUserService, 
  changeUserStatusService, 
  getUserService, 
  listUsersService, 
  updateUserService,
  linkUserToSchoolService,
  linkUserToSchoolClassService
} from "../users.service";
import type { LinkSchoolClassRequest, LinkSchoolRequest, UserFilter } from "../users.types";
import type { UserFormData } from "./user-schema";
import type { PaginationParams } from "@/api/types";

const USERS_QUERY_KEY = ['users'] as const;

export function useUsers(filter?: UserFilter & PaginationParams) {
  return useQuery({
    queryKey: [...USERS_QUERY_KEY, filter],
    queryFn: () => listUsersService(filter),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: number | null) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserService(id as number),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserFormData) => 
      createUserService({
        email: data.email.toLowerCase(),
        registration: data.registration,
        name: data.name,
        role: data.role,
        permissions: data.permissions
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('Usuário cadastrado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao cadastrar usuário.')
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const updateCurrentUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserFormData }) =>
      updateUserService(
        id, 
        {
          email: data.email.toLowerCase(),
          registration: data.registration,
          name: data.name,
          role: data.role,
          permissions: data.permissions
        }
      ),

    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });

      if (
        currentUser &&
        (currentUser.email === updatedUser.email ||
          (currentUser.registration && currentUser.registration === updatedUser.registration))
      ) {
        updateCurrentUser({
          name: updatedUser.name,
          registration: updatedUser.registration,
          email: updatedUser.email.toLowerCase(),
          role: updatedUser.role as UserRole,
          permissions: updatedUser.permissions,
        });
      }

      toast.success('Usuário atualizado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao atualizar usuário.')
  });
}

export function useChangeUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      changeUserStatusService(id),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success(message || 'Status do usuário alterado com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao alterar status do usuário.')
  });
}

export function useLinkUserToSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LinkSchoolRequest }) => 
      linkUserToSchoolService(id, data),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success(message || 'Usuário vinculado à escola com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao vincular usuário à escola.')
  });
}

export function useLinkUserToSchoolClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LinkSchoolClassRequest }) => 
      linkUserToSchoolClassService(id, data),

    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success(message || 'Usuário vinculado à turma com sucesso.');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao vincular usuário à turma.')
  });
}