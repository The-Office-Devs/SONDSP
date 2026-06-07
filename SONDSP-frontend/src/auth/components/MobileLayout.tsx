interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 py-8">
      {children}

      <p className="mt-8 text-xs text-gray-500">© 2026 SONDSP - SECRETÁRIA DA EDUCAÇÃO</p>
    </div>
  );
}