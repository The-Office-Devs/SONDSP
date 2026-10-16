import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { ClassesFilterDesktop } from "./components/classes-filter-desktop";
import { ClassesFilterMobile } from "./components/classes-filter-mobile";

export function ClassesFilterPage() {
   const isDesktop = useIsDesktop();

   useFooter({ title: "Turmas" });

   return isDesktop ? <ClassesFilterDesktop /> : <ClassesFilterMobile />;
}