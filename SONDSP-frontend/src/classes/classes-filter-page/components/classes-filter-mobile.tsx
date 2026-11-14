import { useHeader } from "@/hooks/use-header";
import { ClassesFilterDesktop } from "./classes-filter-desktop";

export function ClassesFilterMobile() {
  useHeader({ title: "Turmas" });

  return <ClassesFilterDesktop />
}