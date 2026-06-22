import { useState, type ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  ClipboardList,
  House,
  PencilLine,
  CircleHelp,
  LogOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { administratorItems, applicationItems } from '@/lib/sidebar-utils';
import { useAuthStore } from '@/auth/auth.store';

export function DesktopShellSidebar() {
  const user = useAuthStore((state) => state.user);
  const [expanded, setExpanded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full">
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col overflow-hidden bg-primary text-white transition-[width] duration-300 ease-out',
          expanded ? 'w-[16rem]' : 'w-[5.25rem]',
        )}
      >
        <div className={cn('flex flex-col gap-8 px-3 py-6', expanded ? 'items-stretch' : 'items-center')}>
          <div className="flex w-fit items-center gap-3 rounded-full bg-white px-2 py-1 text-primary shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-lg font-semibold">{user.name.charAt(0).toUpperCase()}</div>
            {expanded ? <span className="pr-2 text-lg font-semibold">{user.role}</span> : null}
          </div>

          <nav className="flex flex-1 flex-col gap-3 text-white">
            <SidebarItem
              icon={House}
              label="Início"
              expanded={expanded}
              active={location.pathname === '/'}
              onClick={() => navigate('/gerenciamento/usuarios')}
            />

            {expanded ? <SidebarSection title="Área do Administrador" icon={PencilLine} /> : null}
            <div className="space-y-1">
              {administratorItems.map((item) => {
                const path = `/gerenciamento${item.to}`;

                return (
                  <SidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    expanded={expanded}
                    active={location.pathname === path}
                    indent={expanded}
                    onClick={() => navigate(path)}
                  />
                );
              })}
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

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        aria-label={expanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
        className="flex h-full items-center cursor-pointer text-[#9a9a9a] hover:text-[#7f7f7f] transition-all duration-300 hover:bg-[linear-gradient(90deg,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0)_100%)]"
      >
        <ChevronRight
          className={cn(
            'size-5 transition-transform duration-300',
            expanded && 'rotate-180',
          )}
        />
      </button>
    </div>
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
      title={!expanded ? label : ""}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer',
        active ? 'bg-white/12 text-white' : 'text-white/95 hover:bg-white/10',
        !expanded && 'justify-center px-2',
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
      <span className="whitespace-nowrap text-[0.95rem] font-medium leading-tight">
        {title}
      </span>
    </div>
  );
}
