import { useEffect, useMemo, useState } from 'react';
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
import { administratorItems, applicationItems, canAccessItem, isPathActive } from '@/lib/sidebar-utils';
import { canAccess, getHomePath } from '@/auth/role-access';
import { SidebarItem } from '../desktop/sidebar';

type SectionKey = 'admin' | 'application';

interface MobileShellSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileShellSidebar({ open, onClose }: MobileShellSidebarProps) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const [openSections, setOpenSections] = useState<Partial<Record<SectionKey, boolean>>>({});

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

  const rolePermissions = user?.role?.permissions;
  const permissions = useMemo(
    () => rolePermissions?.map((p) => p.permission) ?? [],
    [rolePermissions]
  );
  const isAdmin = user?.role.name === 'Administrador' || (user as any)?.isAdmin;

  const visibleAdminItems = useMemo(
    () => administratorItems.filter((item) => canAccessItem(item, permissions, isAdmin)),
    [permissions, isAdmin]
  );

  const visibleAppItems = useMemo(
    () => applicationItems.filter((item) => canAccessItem(item, permissions, isAdmin)),
    [permissions, isAdmin]
  );

  if (!user) return null;

  const homePath = getHomePath(user);
  const showAdmin = canAccess(user, 'admin') && visibleAdminItems.length > 0;
  const showApplication = canAccess(user, 'application') && visibleAppItems.length > 0;

  const adminHasActiveChild = visibleAdminItems.some((item) =>
    isPathActive(location.pathname, `/gerenciamento${item.to}`),
  );
  const applicationHasActiveChild = visibleAppItems.some((item) =>
    isPathActive(location.pathname, item.to),
  );

  const isSectionOpen = (key: SectionKey, hasActiveChild: boolean) =>
    openSections[key] ?? hasActiveChild;

  const toggleSection = (key: SectionKey, hasActiveChild: boolean) => {
    setOpenSections((prev) => ({ ...prev, [key]: !(prev[key] ?? hasActiveChild) }));
  };

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
      { /* Parte a direita quando o sidebar abre */}
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-black/40 transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <aside
        className={cn(
          'absolute left-0 top-0 flex h-full w-[16.5rem] max-w-[85%] flex-col overflow-hidden bg-primary text-white shadow-xl transition-transform duration-300 ease-out',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full min-h-0 flex-col gap-8 px-3 py-6">
          <div className="flex items-center justify-between">
            <div className="flex w-fit items-center gap-3 rounded-full bg-white px-2 py-1 text-primary shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-lg font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="pr-2 text-lg font-semibold">{user.role.name}</span>
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

          <nav
            className={cn(
              'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden text-white',
              '[scrollbar-width:none]',
              '[-ms-overflow-style:none]',
              '[&::-webkit-scrollbar]:hidden',
            )}
          >
            <SidebarItem
              icon={House}
              label="Início"
              expanded
              active={isPathActive(location.pathname, homePath, true)}
              onClick={() => goTo(homePath)}
            />

            {showAdmin && (
              <div>
                <SidebarItem
                  icon={PencilLine}
                  label="Área do Administrador"
                  expanded
                  onClick={() => toggleSection('admin', adminHasActiveChild)}
                  className={cn(adminHasActiveChild && 'bg-white/10')}
                />
                {isSectionOpen('admin', adminHasActiveChild) && (
                  <div className="mt-3 flex flex-col gap-3">
                    {visibleAdminItems.map((item) => {
                      const path = `/gerenciamento${item.to}`;

                      return (
                        <SidebarItem
                          key={item.label}
                          icon={item.icon}
                          label={item.label}
                          expanded
                          indent
                          active={isPathActive(location.pathname, path)}
                          onClick={() => goTo(path)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {showApplication && (
              <div>
                <SidebarItem
                  icon={ClipboardList}
                  label="Área do Professor"
                  expanded
                  onClick={() => toggleSection('application', applicationHasActiveChild)}
                  className={cn(applicationHasActiveChild && 'bg-white/10')}
                />
                {isSectionOpen('application', applicationHasActiveChild) && (
                  <div className="mt-3 flex flex-col gap-3">
                    {visibleAppItems.map((item) => (
                      <SidebarItem
                        key={item.label}
                        icon={item.icon}
                        label={item.label}
                        expanded
                        indent
                        active={isPathActive(location.pathname, item.to)}
                        onClick={() => goTo(item.to)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <SidebarItem
                icon={CircleHelp}
                label="Ajuda"
                expanded
                active={isPathActive(location.pathname, '/ajuda')}
                onClick={() => goTo('/ajuda')}
              />
              <SidebarItem icon={LogOut} label="Sair" expanded onClick={handleLogout} />
            </div>
          </nav>
        </div>
      </aside>
    </div>
  );
}
