import { useHeader } from "@/hooks/use-header";
import { SurveysHistoryDesktop } from "./surveys-history-desktop";

export function SurveysHistoryMobile() {
  useHeader({ title: "Histórico de Sondagens" });
  
  return <SurveysHistoryDesktop />
}