import { useIsDesktop } from "@/hooks/use-media-query";

import { UsersDesktop } from "./components/users-desktop";
import { UsersMobile } from "./components/users-mobile";

export function UsersPage() {
  const isDesktop = useIsDesktop();

  return isDesktop ? <UsersDesktop /> : <UsersMobile />;
}
