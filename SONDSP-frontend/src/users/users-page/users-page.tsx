import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { UsersDesktop } from "./components/users-desktop";
import { UsersMobile } from "./components/users-mobile";

export function UsersPage() {
  const isDesktop = useIsDesktop();
  useFooter('Cadastro de Usuários');

  return isDesktop ? <UsersDesktop /> : <UsersMobile />;
}
