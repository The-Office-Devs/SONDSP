import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, UserRound } from "lucide-react";

import { useShell } from "@/hooks/use-shell";
import { useAuthStore } from "@/auth/auth.store";
import type { FooterConfig } from "@/contexts/shell-context";

import { MobileShellSidebar } from "./sidebar";

function getFooterTitle(title: FooterConfig["title"]) {
  if (typeof title === "string") return title;
  return title[title.length - 1]?.label ?? "";
}

export function MobileShellHeader() {
  const { header, footer } = useShell();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isBack = header.variant === "back" || !!footer.leftAction;
  const title = header.title || getFooterTitle(footer.title);

  const handleBack = () => {
    if (footer.leftAction) {
      footer.leftAction.onClick();
      return;
    }

    if (location.key === "default") navigate("/");
    else navigate(-1);
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex flex-col bg-primary text-white">
        <div className="flex h-14 items-center gap-2 px-2">
          {isBack ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={footer.leftAction?.disabled}
              aria-label="Voltar"
              className="flex h-10 w-10 shrink-0 items-center justify-center disabled:opacity-50"
            >
              <ArrowLeft className="size-6" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
              className="flex h-10 w-10 shrink-0 items-center justify-center"
            >
              <Menu className="size-6" />
            </button>
          )}

          <span className="flex-1 truncate text-center text-lg font-semibold">
            {title}
          </span>

          <span aria-hidden="true" className="h-10 w-10 shrink-0" />
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
              {user?.role?.name ?? "Cargo"}
            </p>
          </div>
        </div>
      </header>

      {!isBack && (
        <MobileShellSidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
      )}
    </>
  );
}