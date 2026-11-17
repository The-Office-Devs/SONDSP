import { useHeader } from "@/hooks/use-header";
import { SurveysDesktop } from "./surveys-desktop";

export function SurveysMobile() {
  useHeader({ title: "Sondagens" });
  
  return <SurveysDesktop />
}