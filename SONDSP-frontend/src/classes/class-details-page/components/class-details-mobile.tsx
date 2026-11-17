import { useHeader } from "@/hooks/use-header";
import { ClassDetailsDesktop } from "./class-details-desktop";

export function ClassDetailsMobile() {
  useHeader({ title: "Turma" });

  return <ClassDetailsDesktop />
}