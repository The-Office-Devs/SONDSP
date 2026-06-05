import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth.store';
import { loginService } from '../auth.service';
import { UserRole } from '../auth.types';
import type { LoginFormData } from './login.schema';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      loginService({ login: data.login, password: data.password }),

    onSuccess: (response) => {
      login(response.token, {
        name: response.name,
        registration: response.registration,
        role: response.role as UserRole,
        permissions: response.permissions
      });

      navigate('/dashboard');
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
