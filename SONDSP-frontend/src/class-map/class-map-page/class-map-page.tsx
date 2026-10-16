import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { ClassMapDesktop } from "./components/class-map-desktop";
import { ClassMapMobile } from "./components/class-map-mobile";

export function ClassMapPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Mapa de Classe "});

  return isDesktop ? <ClassMapDesktop /> : <ClassMapMobile />
}