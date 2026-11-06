import {
  ClipboardList, 
  LayoutGrid,
  NotebookPen,
  BookOpenText,
  UserRound, 
  Users,
  Puzzle,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { matchPath } from "react-router-dom";

export interface SidebarNavItem {
  label: string;
  icon: LucideIcon;
  to: string;
  permission?: string;
}

export const administratorItems: SidebarNavItem[] = [
  { label: 'Alunos', icon: UserRound, to: '/alunos', permission: 'ALUNO_MANAGE' },
  { label: 'Funções e Permissões', icon: ShieldCheck, to: '/funcoes', permission: 'FUNCAO_VIEW' },
  { label: 'Modelos de Atividades', icon: NotebookPen, to: '/modelos-atividades', permission: 'ATIVIDADE_MANAGE' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas', permission: 'TURMA_MANAGE' },
  { label: 'Usuários', icon: Users, to: '/usuarios', permission: 'USUARIO_MANAGE' },
];

export const applicationItems: SidebarNavItem[] = [
  { label: 'Alunos', icon: UserRound, to: '/app-alunos', permission: 'PORTFOLIO_VIEW' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/app-mapa-classe', permission: 'TURMA_VIEW' },
  { label: 'Sondagens', icon: BookOpenText, to: '/app-sondagens', permission: 'SONDAGEM_VIEW' },
  { label: 'Trajetórias', icon: Puzzle, to: '/app-trajetorias-aprendizagem', permission: 'SONDAGEM_VIEW' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas', permission: 'TURMA_VIEW' },
];

export function canAccessItem(item: SidebarNavItem, permissions: string[] = [], isAdmin = false): boolean {
  if (isAdmin) return true;
  if (!item.permission) return true;

  return permissions.includes(item.permission);
}

export function isPathActive(pathname: string, to: string, exact = false) {
  return matchPath({ path: to, end: exact }, pathname) !== null;
}
