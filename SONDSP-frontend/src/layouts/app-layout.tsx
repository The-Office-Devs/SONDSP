import { Outlet } from 'react-router-dom';

import { AppShell } from '@/components/ui/shell/app-shell';

export function AppLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
