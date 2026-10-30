import {
  ClipboardList, 
  LayoutGrid,
  NotebookPen,
  BookOpenText,
  School,
  UserRound, 
  Users,
  Puzzle,
  ShieldCheck
} from "lucide-react";
import { matchPath } from "react-router-dom";

export const administratorItems = [
  { label: 'Alunos', icon: UserRound, to: '/alunos' },
  { label: 'Escolas', icon: School, to: '/escolas' },
  { label: 'Funções e Permissões', icon: ShieldCheck, to: '/funcoes' },
  { label: 'Modelos de Atividades', icon: NotebookPen, to: '/modelos-atividades' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas' },
  { label: 'Usuários', icon: Users, to: '/usuarios' },
];

export const applicationItems = [
  { label: 'Alunos', icon: UserRound, to: '/app-alunos' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/app-mapa-classe' },
  { label: 'Sondagens', icon: BookOpenText, to: '/app-sondagens' },
  { label: 'Trajetórias', icon: Puzzle, to: '/app-trajetorias-aprendizagem' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas' },
];

export function isPathActive(pathname: string, to: string, exact = false) {
  return matchPath({ path: to, end: exact }, pathname) !== null;
}
