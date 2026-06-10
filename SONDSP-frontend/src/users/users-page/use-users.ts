import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";

import { handleApiError } from "@/lib/utils";
import { 
  createUserService, 
  deleteUserService, 
  getUserService, 
  listUsersService, 
  updateUserService
} from "../users.service";
import type { UsersFormData } from "./users-schema";

const USERS_QUERY_KEY = ['users'] as const;

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: listUsersService,
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
    mutationFn: (data: UsersFormData) => 
      createUserService({
        email: data.email,
        registration: data.registration,
        name: data.name,
        role: data.role,
        permissions: data.permissions
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('Usuário cadastrado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UsersFormData }) =>
      updateUserService(
        id, 
        {
          email: data.email,
          registration: data.registration,
          name: data.name,
          role: data.role,
          permissions: data.permissions
        }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('Usuário atualizado com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => 
      deleteUserService(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
      toast.success('Usuário excluído com sucesso!');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });
}