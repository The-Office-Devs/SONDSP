import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, Search, UserRound } from "lucide-react";

import { useShell } from "@/hooks/use-shell";
import { useAuthStore } from "@/auth/auth.store";

import { MobileShellSidebar } from "./sidebar";

export function MobileShellHeader() {
  const { header } = useShell();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleBack = () => { navigate(-1) };

  // TODO: implementar o onSearch para expandir quando abrir e passar onSearch pro campo que abrir
  return (
    <>
      <header className="sticky top-0 z-30 flex flex-col bg-primary text-white">
        <div className="flex h-14 items-center gap-2 px-2">
          {header.variant === "menu" ? (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <Menu className="size-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleBack}
              aria-label="Voltar"
              className="flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <ArrowLeft className="size-6" />
            </button>
          )}

          <span className="flex-1 truncate text-center text-lg font-semibold">
            {header.title}
          </span>

          <button
            type="button"
            aria-label="Buscar"
            className="flex h-10 w-10 shrink-0 items-center justify-center"
            onClick={header.onSearch}
          >
            <Search className="size-6" />
          </button>
        </div>

        <div className="flex items-center gap-3 px-3 pb-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
            <UserRound className="size-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight">
              {user?.name ?? "Usuário"}
            </p>
            <p className="truncate text-xs leading-tight text-white/70">
              {user?.role ?? "Cargo"}
            </p>
          </div>
        </div>
      </header>

      {header.variant === "menu" ? (
        <MobileShellSidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      ) : null}
    </>
  );
}