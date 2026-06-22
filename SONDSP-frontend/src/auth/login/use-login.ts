import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { handleApiError } from '@/lib/utils';
import { useAuthStore } from '../auth.store';
import { loginService } from '../auth.service';
import { UserRole } from '../auth.types';

import type { LoginFormData } from './login.schema';
import type { AxiosError } from 'axios';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      loginService({ login: data.login, password: data.password }),

    onSuccess: (response) => {
      login(response.token);
      navigate('/gerenciamento/usuarios');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error)
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
}
