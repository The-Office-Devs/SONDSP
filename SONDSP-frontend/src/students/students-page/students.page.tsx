import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { StudentsDesktop } from "./components/students-desktop";
import { StudentsMobile } from "./components/students-mobile";

export function StudentsPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Gerenciamento de Alunos" });

  return isDesktop ? <StudentsDesktop /> : <StudentsMobile />;
}