import { 
  BarChart3, 
  BookOpenText, 
  ClipboardList, 
  LayoutGrid, 
  School, 
  UserRound, 
  Users 
} from "lucide-react";

export const administratorItems = [
  { label: 'Alunos', icon: UserRound, to: '/alunos' },
  { label: 'Escolas', icon: School, to: '/escolas' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas' },
  { label: 'Usuários', icon: Users, to: '/usuarios' },
];

export const applicationItems = [
  { label: 'Alunos', icon: UserRound, to: '/app-alunos' },
  { label: 'Dashboards', icon: BarChart3, to: '/dashboards' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/mapa-classe' },
  { label: 'Sondagens', icon: BookOpenText, to: '/sondagens' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas' },
];