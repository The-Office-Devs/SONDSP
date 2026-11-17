import { useHeader } from "@/hooks/use-header";
import { UsersDesktop } from "./users-desktop";

export function UsersMobile() {
  useHeader({ title: "Gerenciamento de usuários", });
  
  return <UsersDesktop />;
}