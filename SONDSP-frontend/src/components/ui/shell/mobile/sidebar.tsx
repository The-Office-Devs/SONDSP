import { useEffect, type ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ClipboardList,
  House,
  PencilLine,
  CircleHelp,
  LogOut,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useAuthStore } from '@/auth/auth.store';
import { administratorItems, applicationItems } from '@/lib/sidebar-utils';

interface MobileShellSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileShellSidebar({ open, onClose }: MobileShellSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  // Evita scroll enquanto o sidebar ta aberto
  useEffect(() => {
    if (open) {
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previous;
      };
    }
  }, [open]);

  const goTo = (to: string) => {
    navigate(to);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose();
  };

  return (
    <div className={cn(
        'fixed inset-0 z-40 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
    >
      { /* Parte a direita quando o sidebar abre */ }
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        className={cn(
          'absolute left-0 top-0 flex h-full w-[18rem] max-w-[85%] flex-col overflow-y-auto bg-primary text-white shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex flex-col gap-8 px-3 py-6">
          <div className="flex items-center justify-between">
            <div className="flex w-fit items-center gap-3 rounded-full bg-white px-2 py-1 text-primary shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-lg font-semibold">
                P
              </div>
              <span className="pr-2 text-lg font-semibold"> Professor </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
            >
              <X className="size-6" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-3">
            <MobileSidebarItem
              icon={House}
              label="Início"
              active={location.pathname === '/'}
              onClick={() => goTo('/')}
            />

            <MobileSidebarSection title="Área do Administrador" icon={PencilLine} />

            <div className="space-y-1">
              {administratorItems.map((item) => {
                const path = `/gerenciamento${item.to}`;

                return (
                  <MobileSidebarItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    indent
                    active={location.pathname === path}
                    onClick={() => goTo(path)}
                  />
                );
              })}
            </div>

            <MobileSidebarSection title="Área de Aplicação" icon={ClipboardList} />
            
            <div className="space-y-1">
              {applicationItems.map((item) => (
                <MobileSidebarItem
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  indent
                  active={location.pathname === item.to}
                  onClick={() => goTo(item.to)}
                />
              ))}
            </div>

            <div className="mt-2 space-y-1">
              <MobileSidebarItem icon={CircleHelp} label="Ajuda" onClick={onClose} />
              <MobileSidebarItem icon={LogOut} label="Sair" onClick={handleLogout} />
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}

interface MobileSidebarItemProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  indent?: boolean;
  active?: boolean;
  onClick?: () => void;
}

function MobileSidebarItem({ icon: Icon, label, indent = false, active = false, onClick }: MobileSidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        active ? 'bg-white/12 text-white' : 'text-white/95 hover:bg-white/10',
        indent && 'pl-5',
      )}
    >
      <Icon className="size-6 shrink-0" />
      <span className="truncate text-[1.05rem] font-medium">{label}</span>
    </button>
  );
}

interface MobileSidebarSectionProps {
  icon: ComponentType<{ className?: string }>;
  title: string;
}

function MobileSidebarSection({ icon: Icon, title }: MobileSidebarSectionProps) {
  return (
    <div className="mt-3 flex items-start gap-3 px-3 text-white/90">
      <Icon className="mt-0.5 size-5 shrink-0" />
      <span className="whitespace-nowrap text-[0.95rem] font-medium leading-tight">{title}</span>
    </div>
  );
}