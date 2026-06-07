import { useState, type ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  House,
  LayoutGrid,
  PencilLine,
  School,
  Settings2,
  UserRound,
  Users,
  CircleHelp,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/auth/auth.store';

const administratorItems = [
  { label: 'Usuários', icon: Users, to: '/usuarios' },
  { label: 'Escolas', icon: School, to: '/escolas' },
  { label: 'Turmas', icon: ClipboardList, to: '/turmas' },
  { label: 'Alunos', icon: UserRound, to: '/alunos' },
];

const applicationItems = [
  { label: 'Dashboards', icon: BarChart3, to: '/dashboards' },
  { label: 'Mapa de Classe', icon: LayoutGrid, to: '/mapa-classe' },
  { label: 'Turmas', icon: ClipboardList, to: '/app-turmas' },
  { label: 'Alunos', icon: UserRound, to: '/app-alunos' },
];

export function ShellSidebar() {
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col overflow-hidden bg-[#05366f] text-white transition-[width] duration-300 ease-out',
        expanded ? 'w-[16rem]' : 'w-[5.25rem]',
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className={cn(
          'absolute right-[-0.85rem] top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-all hover:scale-105',
          expanded ? 'bg-[#5d9cf1] text-[#05366f]' : 'bg-white text-[#5d9cf1]',
        )}
        aria-label={expanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
      >
        <ChevronRight className={cn('size-4 transition-transform -translate-x-1/3', expanded && 'rotate-180')} />
      </button>

      <div className={cn('flex flex-col gap-8 px-3 py-6', expanded ? 'items-stretch' : 'items-center')}>
        <div className="flex w-fit items-center gap-3 rounded-full bg-white px-2 py-1 text-[#041a3a] shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-lg font-semibold">P</div>
          {expanded ? <span className="pr-2 text-lg font-semibold">Professor</span> : null}
        </div>

        <nav className="flex flex-1 flex-col gap-3 text-white">
          <SidebarItem
            icon={House}
            label="Início"
            expanded={expanded}
            active={location.pathname === '/'}
            onClick={() => navigate('/')}
          />

          {expanded ? <SidebarSection title="Área do Administrador" icon={PencilLine} /> : null}
          <div className="space-y-1">
            {administratorItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                active={location.pathname === item.to}
                indent={expanded}
                onClick={() => navigate(item.to)}
              />
            ))}
          </div>

          {expanded ? <SidebarSection title="Área de Aplicação" icon={ClipboardList} /> : null}
          <div className="space-y-1">
            {applicationItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                indent={expanded}
                onClick={() => navigate(item.to)}
              />
            ))}
          </div>

          <div className="mt-2 space-y-1">
            <SidebarItem icon={CircleHelp} label="Ajuda" expanded={expanded} onClick={() => {}} />
            <SidebarItem icon={LogOut} label="Sair" expanded={expanded} onClick={handleLogout} />
          </div>
        </nav>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  expanded: boolean;
  indent?: boolean;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ icon: Icon, label, expanded, indent = false, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        active ? 'bg-white/12 text-white' : 'text-white/95 hover:bg-white/10',
        !expanded && 'justify-center px-0',
        indent && expanded && 'pl-5',
      )}
    >
      <Icon className="size-6 shrink-0" />
      {expanded ? <span className="truncate text-[1.05rem] font-medium">{label}</span> : null}
    </button>
  );
}

interface SidebarSectionProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
}

export function SidebarSection({ icon: Icon, title }: SidebarSectionProps) {
  return (
    <div className="mt-3 flex items-start gap-3 px-3 text-white/90">
      <Icon className="mt-0.5 size-5 shrink-0" />
      <span className="text-[0.95rem] font-medium leading-tight">{title}</span>
    </div>
  );
}
