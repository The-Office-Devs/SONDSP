import { NavLink } from "react-router-dom";
import { House, Users, UserRound, CircleHelp } from "lucide-react";
import { Button } from "../../button";

import { useShell } from "@/hooks/use-shell";

export function MobileShellFooter() {
  const { footer } = useShell();

  if (footer.useMobileDefaultFooter) {
    const itemClass = ({ isActive }: { isActive: boolean }) =>
      [
        "flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium",
        isActive ? "text-[#0066cc]" : "text-slate-700",
      ].join(" ");

    return (
      <footer className="border-t border-slate-200 bg-white px-2 py-1">
        <nav className="grid grid-cols-4 items-center">
          <NavLink to="/inicio" className={itemClass} end>
            <House className="size-6" strokeWidth={2} />
            <span> Início </span>
          </NavLink>

          <NavLink to="/turmas" className={itemClass}>
            <Users className="size-6" strokeWidth={2} />
            <span> Turmas </span>
          </NavLink>

          <NavLink to="/perfil" className={itemClass}>
            <UserRound className="size-6" strokeWidth={2} />
            <span> Perfil </span>
          </NavLink>

          <NavLink to="/ajuda" className={itemClass}>
            <CircleHelp className="size-6" strokeWidth={2} />
            <span> Ajuda </span>
          </NavLink>
        </nav>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/10 bg-[#0a4b93] px-3 py-2 text-white">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0">
          {footer.leftAction && (
            <Button
              onClick={footer.leftAction.onClick}
              className="h-10 w-auto shrink-0 px-3 text-xs shadow-sm"
              disabled={footer.leftAction.disabled}
              title={footer.leftAction.label}
            >
              {footer.leftAction.icon}
              <span>{footer.leftAction.label}</span>
            </Button>
          )}
        </div>

        <div className="flex min-w-0 justify-end">
          {footer.rightAction && (
            <Button
              onClick={footer.rightAction.onClick}
              className="h-10 w-auto shrink-0 px-3 text-xs shadow-sm"
              disabled={footer.rightAction.disabled}
              title={footer.rightAction.label}
            >
              {footer.rightAction.icon}
              <span>{footer.rightAction.label}</span>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}
