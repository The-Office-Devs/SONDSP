import { NavLink, useNavigate } from "react-router-dom";
import { House, Users, CircleHelp, BookOpenText, LogOut } from "lucide-react";

import { useAuthStore } from "@/auth/auth.store";

const itemClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex flex-col items-center justify-center gap-1 py-1.5 text-[11px] font-medium",
    isActive ? "text-[#0066cc]" : "text-slate-700",
  ].join(" ");

export function MobileShellFooter() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <footer className="sticky bottom-0 z-30 border-t border-slate-200 bg-white px-2 py-1">
      <nav className="grid grid-cols-5 items-center">
        <NavLink to="/" className={itemClass} end>
          <House className="size-6" strokeWidth={2} />
          <span> Início </span>
        </NavLink>

        <NavLink to="/app-turmas" className={itemClass}>
          <Users className="size-6" strokeWidth={2} />
          <span> Turmas </span>
        </NavLink>

        <NavLink to="/app-sondagens" className={itemClass}>
          <BookOpenText className="size-6" strokeWidth={2} />
          <span> Sondagens </span>
        </NavLink>

        <NavLink to="/ajuda" className={itemClass}>
          <CircleHelp className="size-6" strokeWidth={2} />
          <span> Ajuda </span>
        </NavLink>

        <button type="button" onClick={handleLogout} className={itemClass({ isActive: false })}>
          <LogOut className="size-6" strokeWidth={2} />
          <span> Sair </span>
        </button>
      </nav>
    </footer>
  );
}
