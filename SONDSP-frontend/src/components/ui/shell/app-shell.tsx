import { type PropsWithChildren } from 'react';

import { ShellHeader } from './header';
import { ShellSidebar } from './sidebar';
import { ShellFooter } from './footer';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f2f4f8] text-slate-900">
      <ShellHeader />
      <div className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] overflow-hidden">
        <ShellSidebar />
        <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <ShellFooter />
    </div>
  );
}
