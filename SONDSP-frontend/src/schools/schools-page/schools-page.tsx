import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { SchoolsDesktop } from "./components/schools-desktop";
import { SchoolsMobile } from "./components/schools-mobile";

export function SchoolsPage() {
  const isDesktop = useIsDesktop();
  useFooter({ title: 'Gerenciamento de Escolas' });

  return isDesktop ? <SchoolsDesktop /> : <SchoolsMobile />;
}
