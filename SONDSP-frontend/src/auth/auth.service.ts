import { api } from '@/api/axios';
import type { ActivateAccountRequest, LoginRequest, LoginResponse, ResetPasswordRequest } from './auth.types';

export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function getMeService(): Promise<any> {
  const response = await api.get<any>('/auth/me');
  return response.data;
}

export async function activateAccountService(data: ActivateAccountRequest): Promise<void> {
  await api.post('/auth/first-access', data);
}

export async function forgotPasswordService(email: string): Promise<void> {
  await api.post('/auth/password-recovery', { email });
}

export async function resetPasswordService(data: ResetPasswordRequest): Promise<void> {
  await api.post('/auth/password-reset', data);
}