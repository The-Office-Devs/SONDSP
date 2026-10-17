import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { StudentsFilterDesktop } from "./components/students-filter-desktop";
import { StudentsFilterMobile } from "./components/students-filter-mobile";

export function StudentsFilterPage() {
   const isDesktop = useIsDesktop();

   useFooter({ title: "Alunos" });

   return isDesktop ? <StudentsFilterDesktop /> : <StudentsFilterMobile />;
}