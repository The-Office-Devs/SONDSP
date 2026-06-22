import bgImage from '@/assets/image-bg.png';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="relative hidden lg:block lg:w-1/2">
        <div
          className="h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-slate-50 p-8">
        {children}
      </div>
    </div>
  )
}