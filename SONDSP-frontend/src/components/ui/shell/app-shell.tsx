import { type ReactNode } from 'react';

import { ShellHeader } from './header';
import { ShellSidebar } from './sidebar';
import { ShellFooter } from './footer';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f2f4f8] text-slate-900">
      <ShellHeader />
      <div className="grid min-h-[calc(100vh-5.5rem)] grid-cols-[auto_minmax(0,1fr)] overflow-hidden">
        <ShellSidebar />
        <div className="flex min-w-0 flex-col overflow-hidden">
          <main className="min-h-0 flex-1 overflow-auto">{children}</main>
          <ShellFooter />
        </div>
      </div>
    </div>
  );
}
