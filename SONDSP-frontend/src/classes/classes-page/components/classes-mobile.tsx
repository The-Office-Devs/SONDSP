import { useHeader } from "@/hooks/use-header";
import { ClassesDesktop } from "./classes-desktop";

export function ClassesMobile() {
  useHeader({ title: "Gerenciamento de turmas", });
  
  return <ClassesDesktop />
}