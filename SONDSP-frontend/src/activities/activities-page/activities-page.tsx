import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { ActivitiesDesktop } from "./components/activities-desktop";
import { ActivitiesMobile } from "./components/activities-mobile";

export function ActivitiesPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Gerenciamento de Modelos de Atividades" });

  return isDesktop ? <ActivitiesDesktop /> : <ActivitiesMobile />;
}