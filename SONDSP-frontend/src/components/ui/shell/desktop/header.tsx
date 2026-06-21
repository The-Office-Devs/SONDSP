import { CircleHelp, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import brasaoSp from '@/assets/brasao-sp.png';
import { useAuthStore } from '@/auth/auth.store';

const roleLabels: Record<string, string> = {
  'Administrador': 'Administrador',
  'Administrador da Escola': 'Administrador da Escola',
  'Coordenador': 'Coordenador',
  'Professor': 'Professor',
  'POA' : 'Professor Orientador de Área'
};

export function DesktopShellHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-white/10 bg-[#0a4b93] text-white">
      <div className="flex items-stretch gap-6 px-5 py-4 lg:px-6">
        <div className="flex min-w-[180px] items-center gap-3 border-r border-white/25 pr-6">
          <img src={brasaoSp} alt="Brasão da Prefeitura de São Paulo" className="h-14 w-auto" />
          <div className="leading-tight">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">Prefeitura de São Paulo</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/90">Secretaria de Educação</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center">
          <div className="min-w-0">
            <h1 className="truncate text-[1.45rem] font-medium leading-tight">{user.name}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm text-white/65">
              <span className="h-2 w-2 rounded-full bg-white/65" />
              <span> Função: {user.role} </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-white lg:gap-5">
          <button
            type="button"
            className="flex items-center gap-2 text-[1.05rem] font-medium transition-opacity hover:opacity-80 cursor-pointer"
          >
            <CircleHelp className="size-8" />
            <span>Ajuda</span>
          </button>

          <span className="h-10 w-px bg-white/25" aria-hidden="true" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-[1.05rem] font-medium transition-opacity hover:opacity-80 cursor-pointer"
          >
            <LogOut className="size-8" />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
