import { 
  BarChart3, 
  ClipboardList, 
  LayoutGrid, 
  School, 
  UserRound, 
  Users 
} from "lucide-react";

export const administratorItems = [
  { label: 'Usuários', icon: Users, to: '/usuarios' },
  { label: 'Escolas', icon: School, to: '/escolas' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas' },
  { label: 'Alunos', icon: UserRound, to: '/alunos' },
];

export const applicationItems = [
  { label: 'Dashboards', icon: BarChart3, to: '/dashboards' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/mapa-classe' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas' },
  { label: 'Alunos', icon: UserRound, to: '/app-alunos' },
];