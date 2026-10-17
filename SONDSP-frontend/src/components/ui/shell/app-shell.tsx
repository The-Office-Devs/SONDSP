import { type PropsWithChildren } from 'react';
import { useIsDesktop } from '@/hooks/use-media-query';

import { DesktopShellHeader } from './desktop/header';
import { DesktopShellSidebar } from './desktop/sidebar';
import { DesktopShellFooter } from './desktop/footer';

import { MobileShellHeader } from './mobile/header';
import { MobileShellFooter } from './mobile/footer';

export function AppShell({ children }: PropsWithChildren) {
  const isDesktop = useIsDesktop();

  return (
    <>
      {isDesktop ? (
        <div className="flex h-screen flex-col overflow-hidden bg-[#f2f4f8] text-slate-900">
          <DesktopShellHeader />
          <div className="grid min-h-0 flex-1 grid-cols-[auto_minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden">
            <DesktopShellSidebar />
            <main className="relative min-h-0 flex-1 overflow-y-auto">{children}</main>
          </div>
          <DesktopShellFooter />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col bg-[#f2f4f8] text-slate-900">
          <MobileShellHeader  />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
          <MobileShellFooter />
        </div>
      )}
    </>
  );
}