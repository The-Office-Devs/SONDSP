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
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    admin: false,
    application: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParentClick = (key: string) => {
    if (!expanded) {
      setExpanded(true);
      setOpenSections({ admin: false, application: false, [key]: true });
    } else {
      toggleSection(key);
    }
  };

  const adminHasActiveChild = administratorItems.some(
    (item) => location.pathname === `/gerenciamento${item.to}`,
  );
  const applicationHasActiveChild = applicationItems.some(
    (item) => location.pathname === item.to,
  );

  return (
    <div className="flex h-full">
      <aside
        className={cn(
          'flex h-full shrink-0 flex-col overflow-hidden bg-primary text-white transition-[width] duration-300 ease-out',
          expanded ? 'w-[16.5rem]' : 'w-[5.25rem]',
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

            <div className="group/admin">
              <SidebarItem
                icon={PencilLine}
                label="Área do Administrador"
                expanded={expanded}
                onClick={() => handleParentClick('admin')}
                className={cn(
                  'group-hover/admin:bg-white/10',
                  adminHasActiveChild && 'bg-white/10',
                )}
              />
              {expanded && openSections.admin && (
                <div className="mt-3 flex flex-col gap-3">
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
              )}
            </div>

            <div className="group/application">
              <SidebarItem
                icon={ClipboardList}
                label="Área de Aplicação"
                expanded={expanded}
                onClick={() => handleParentClick('application')}
                className={cn(
                  'group-hover/application:bg-white/10',
                  applicationHasActiveChild && 'bg-white/10',
                )}
              />
              {expanded && openSections.application && (
                <div className="mt-3 flex flex-col gap-3">
                  {applicationItems.map((item) => (
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
              )}
            </div>

            <div className="flex flex-col gap-3">
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
  className?: string;
}

export function SidebarItem({ icon: Icon, label, expanded, indent = false, active = false, onClick, className }: SidebarItemProps) {
  return (
    <button
      type="button"
      title={!expanded ? label : ""}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors cursor-pointer',
        active ? 'bg-white/12 text-white' : 'text-white/95 hover:bg-white/10',
        !expanded && 'justify-center px-2',
        indent && expanded && 'pl-12',
        className,
      )}
    >
      <Icon className="size-6 shrink-0" />
      {expanded ? <span className="truncate text-[1.05rem] font-medium">{label}</span> : null}
    </button>
  );
}