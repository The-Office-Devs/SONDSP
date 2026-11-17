import { useHeader } from "@/hooks/use-header";
import { StudentsDesktop } from "./students-desktop";

export function StudentsMobile() {
  useHeader({ title: "Gerenciamento de alunos", });
  
  return <StudentsDesktop />;
}