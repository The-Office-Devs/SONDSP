import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { ClassesDesktop } from "./components/classes-desktop";
import { ClassesMobile } from "./components/classes-mobile";

export function ClassesPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Gerenciamento de Turmas" });

  return isDesktop ? <ClassesDesktop /> : <ClassesMobile />;
}