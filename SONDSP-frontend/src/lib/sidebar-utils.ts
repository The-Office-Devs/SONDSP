import { 
  BarChart3, 
  ClipboardList, 
  ClipboardPenLine, 
  LayoutGrid,
  NotebookPen,
  BookOpenText,
  School,
  UserRound, 
  Users 
} from "lucide-react";
import { matchPath } from "react-router-dom";

export const administratorItems = [
  { label: 'Alunos', icon: UserRound, to: '/alunos' },
  { label: 'Eixos', icon: ClipboardPenLine, to: '/eixos' },
  { label: 'Escolas', icon: School, to: '/escolas' },
  { label: 'Modelos de Atividades', icon: NotebookPen, to: '/modelos-atividades' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas' },
  { label: 'Usuários', icon: Users, to: '/usuarios' },
];

export const applicationItems = [
  { label: 'Alunos', icon: UserRound, to: '/app-alunos' },
  { label: 'Dashboards', icon: BarChart3, to: '/dashboards' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/app-mapa-classe' },
  { label: 'Sondagens', icon: BookOpenText, to: '/app-sondagens' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas' },
];

export function isPathActive(pathname: string, to: string, exact = false) {
  return matchPath({ path: to, end: exact }, pathname) !== null;
}