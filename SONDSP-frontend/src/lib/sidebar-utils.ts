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
  permissions?: string[];
}

export const administratorItems: SidebarNavItem[] = [
  { label: 'Alunos', icon: UserRound, to: '/alunos', permissions: ['ALUNO_VIEW', 'ALUNO_MANAGE', 'ALUNO_IMPORT', 'ALUNO_STATUS'] },
  { label: 'Funções e Permissões', icon: ShieldCheck, to: '/funcoes', permissions: ['FUNCAO_VIEW', 'FUNCAO_MANAGE'] },
  { label: 'Modelos de Atividades', icon: NotebookPen, to: '/modelos-atividades', permissions: ['ATIVIDADE_VIEW', 'ATIVIDADE_MANAGE', 'ATIVIDADE_STATUS'] },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas', permissions: ['TURMA_VIEW', 'TURMA_MANAGE', 'TURMA_STATUS'] },
  { label: 'Usuários', icon: Users, to: '/usuarios', permissions: ['USUARIO_VIEW', 'USUARIO_MANAGE', 'USUARIO_STATUS'] },
];

export const applicationItems: SidebarNavItem[] = [
  { label: 'Alunos', icon: UserRound, to: '/app-alunos', permissions: ['PORTFOLIO_VIEW', 'ALUNO_VIEW'] },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/app-mapa-classe', permissions: ['TURMA_VIEW', 'SONDAGEM_VIEW'] },
  { label: 'Sondagens', icon: BookOpenText, to: '/app-sondagens', permissions: ['SONDAGEM_VIEW', 'SONDAGEM_MANAGE'] },
  { label: 'Trajetórias', icon: Puzzle, to: '/app-trajetorias-aprendizagem', permissions: ['SONDAGEM_VIEW', 'PORTFOLIO_VIEW'] },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas', permissions: ['TURMA_VIEW'] },
];

export function canAccessItem(item: SidebarNavItem, permissions: string[] = [], isAdmin = false): boolean {
  if (isAdmin) return true;
  if (!item.permissions || item.permissions.length === 0) return true;
  return item.permissions.some((p) => permissions.includes(p));
}

export function isPathActive(pathname: string, to: string, exact = false) {
  return matchPath({ path: to, end: exact }, pathname) !== null;
}
