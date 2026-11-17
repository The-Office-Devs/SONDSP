import type { Role } from "@/roles/roles.types";

export interface AuthUser {
  id: number;
  name: string;
  registration: string;
  email?: string;
  role: Role;
  permissions: string[];
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  registration: string;
  role: Role;
  token: string;
  permissions: string[];
  refreshToken: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ActivateAccountRequest {
  registration: string;
  email: string;
  password: string;
}

export interface ValidateActivationRequest {
  registration: string;
  email: string;
  code: string;
}

export interface ActivationValidationResponse {
  temporaryToken: string;
  email: string;
  name: string;
}

export interface CompleteActivationRequest {
  temporaryToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResendActivationRequest {
  registration: string;
  email: string;
}