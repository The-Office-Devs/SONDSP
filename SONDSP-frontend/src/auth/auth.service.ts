import { api } from '@/api/axios';
import type { 
  ActivateAccountRequest, 
  ActivationValidationResponse,
  CompleteActivationRequest,
  LoginRequest, 
  LoginResponse, 
  ResendActivationRequest,
  ResetPasswordRequest,
  ValidateActivationRequest
} from './auth.types';

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

export async function validateActivationService(data: ValidateActivationRequest): Promise<ActivationValidationResponse> {
  const response = await api.post<ActivationValidationResponse>('/auth/validate-activation', data);
  return response.data;
}

export async function completeActivationService(data: CompleteActivationRequest): Promise<void> {
  await api.post('/auth/complete-activation', data);
}

export async function resendActivationService(data: ResendActivationRequest): Promise<{ mensagem: string }> {
  const response = await api.post<{ mensagem: string }>('/auth/resend-activation', data);
  return response.data;
}

export async function forgotPasswordService(email: string): Promise<void> {
  await api.post('/auth/password-recovery', { email });
}

export async function resetPasswordService(data: ResetPasswordRequest): Promise<void> {
  await api.post('/auth/password-reset', data);
}