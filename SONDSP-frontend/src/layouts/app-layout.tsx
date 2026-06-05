import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';

import { useIsDesktop } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    to: '/dashboard',
    label: 'Turmas',
    icon: Users,
  },
];

function DesktopNavigation() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4">
      <div className="mb-8 px-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">SONDSP</p>
        <h1 className="text-lg font-bold text-slate-900">Portal do Educador</h1>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function MobileNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-200 bg-white px-4 py-2">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navigationItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-md px-3 py-1 text-xs font-medium transition-colors',
                isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-900',
              )
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AppLayout() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen">
          <DesktopNavigation />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <main className="px-4 py-6">
        <Outlet />
      </main>
      <MobileNavigation />
    </div>
  );
}
