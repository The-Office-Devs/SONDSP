import { useHeader } from "@/hooks/use-header";
import { ActivitiesDesktop } from "./activities-desktop";

export function ActivitiesMobile() {
  useHeader({ title: "Gerenciamento de Modelos de Atividades" });

  return <ActivitiesDesktop />;
}