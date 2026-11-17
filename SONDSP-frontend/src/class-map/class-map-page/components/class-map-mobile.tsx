import { useHeader } from "@/hooks/use-header";
import { ClassMapDesktop } from "./class-map-desktop";

export function ClassMapMobile() {
  useHeader({ title: "Mapa de Classe" });
  
  return <ClassMapDesktop />
}