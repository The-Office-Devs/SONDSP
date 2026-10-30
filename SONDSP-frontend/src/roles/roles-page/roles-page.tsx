import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { RolesDesktop } from "./components/roles-desktop";
import { RolesMobile } from "./components/roles-mobile";

export function RolesPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Gerenciamento de Funções e Permissões" });

  return isDesktop ? <RolesDesktop /> : <RolesMobile />;
}
