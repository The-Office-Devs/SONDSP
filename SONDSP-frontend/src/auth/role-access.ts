import { UserRole } from "./auth.types";

export type AppArea = 'admin' | 'application';

const AREA_ROLES: Record<AppArea, readonly UserRole[]> = {
  admin: [UserRole.Administrador, UserRole["Administrador da Escola"]],
  application: [UserRole.Coordenador, UserRole.Professor, UserRole.POA]
};

const HOME_BY_AREA: Record<AppArea, string> = {
  admin: '/gerenciamento/usuarios',
  application: '/app-turmas'
};

export function canAccess(role: UserRole, area: AppArea) {
  return AREA_ROLES[area].includes(role);
};

export function getHomePath(role: UserRole) {
  if (canAccess(role, 'admin')) return HOME_BY_AREA.admin;
  if (canAccess(role, 'application')) return HOME_BY_AREA.application;
  return '/login'; 
};