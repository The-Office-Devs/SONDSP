import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { handleApiError } from '@/lib/utils';
import { useAuthStore } from '../auth.store';
import { loginService } from '../auth.service';

import type { LoginFormData } from './login.schema';
import type { AxiosError } from 'axios';

type LoginVariables = LoginFormData & {
  keepMeSigned: boolean;
};

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: (data: LoginVariables) => {
      return loginService({ 
        login: data.login.toLowerCase(), 
        password: data.password
      });
    },

    onSuccess: (response, variables) => {
      login(response.token);

      if (response.refreshToken) {
        if (variables.keepMeSigned) {
          localStorage.setItem('refreshToken', response.refreshToken);
        } else {
          sessionStorage.setItem('refreshToken', response.refreshToken);
        }
      }

      navigate('/gerenciamento/usuarios');
    },

    onError: (error: AxiosError<{ error: string }>) =>
      handleApiError(error || 'Erro ao realizar login.')
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending
  };
}
