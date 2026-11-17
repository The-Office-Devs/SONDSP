import { useHeader } from "@/hooks/use-header";
import { StudentsFilterDesktop } from "./students-filter-desktop";

export function StudentsFilterMobile() {
  useHeader({ title: "Alunos" });

  return <StudentsFilterDesktop />;
}