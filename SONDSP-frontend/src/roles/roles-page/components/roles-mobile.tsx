import { useHeader } from "@/hooks/use-header";
import { RolesDesktop } from "./roles-desktop";

export function RolesMobile() {
  useHeader({ title: "Funções e Permissões" });

  return <RolesDesktop />;
}
