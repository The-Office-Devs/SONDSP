import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { StrandsDesktop } from "./components/strands-desktop";
import { StrandsMobile } from "./components/strands-mobile";

export function StrandsPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Gerenciamento de Eixos" });

  return isDesktop ? <StrandsDesktop /> : <StrandsMobile />;
}