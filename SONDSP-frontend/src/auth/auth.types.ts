export const UserRole = {
  ADMINISTRATOR: 'Administrator',
  SCHOOL_ADMINISTRATOR: 'School Administrator',
  COORDINATOR: 'Coordinator',
  TEACHER: 'Teacher',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface AuthUser {
  name: string;
  registration: string;
  role: UserRole;
  permissions: string[];
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  name: string;
  registration: string;
  role: string;
  token: string;
  permissions: string[];
}

export interface ResetPasswordRequest {
  email: string;
  password: string;
}

export interface ActivateAccountRequest {
  registration: string;
  email: string;
  password: string;
}