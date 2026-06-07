import { Card, CardContent } from "@/components/ui/card";

import type { Ui } from "@/components/HookForm/types";

interface LoginCardProps {
  type?: Ui;
  children: React.ReactNode;
}

const variants = {
  desktop: {
    card: 'w-full max-w-lg shadow-lg',
    content: 'px-8 pb-8 pt-8',
    title: 'text-xl font-semibold text-gray-900',
    subtitle: 'mt-1 text-sm text-gray-500',
    divider: '-mx-8 mt-3 h-px bg-gray-300',
    subtitleText: 'Sondagem Educacional',
  },
  mobile: {
    card: 'w-full max-w-md shadow-xl',
    content: 'px-6 pb-8 pt-10',
    title: 'text-2xl font-bold text-gray-900',
    subtitle: 'mt-1 text-sm uppercase tracking-wide text-gray-500',
    divider: '-mx-6 mt-3 h-px bg-gray-300',
    subtitleText: 'Portal do Educador',
  }
}

export function AuthCard({ type = 'desktop', children }: LoginCardProps) {
  const v = variants[type];

  return (
    <Card className={v.card}>
      <CardContent className={v.content}>
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center">
            <img
              src="/src/assets/brasao-sp.png"
              alt="Brasão Estado de São Paulo"
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className={v.title}> SONDSP </h2>
          <p className={v.subtitle}> {v.subtitleText} </p>
          <div className={v.divider} />
        </div>

        {children}
      </CardContent>
    </Card>
  );
}