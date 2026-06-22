import { Outlet } from 'react-router-dom';

import { ShellProvider } from '@/contexts/shell-provider';
import { AppShell } from '@/components/ui/shell/app-shell';

export function AppLayout() {
  return (
    <ShellProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </ShellProvider>
  );
}
