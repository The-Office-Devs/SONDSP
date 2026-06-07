import { api } from '@/api/axios';
import type { ActivateAccountRequest, LoginRequest, LoginResponse } from './auth.types';

export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function activateAccountService(data: ActivateAccountRequest): Promise<void> {
  await api.post('/auth/activate-user', data);
}

export async function forgotPasswordService(email: string): Promise<void> {
  await api.post('/auth/send-change-password-email', { email });
}