import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { SurveysHistoryDesktop } from "./components/surveys-history-desktop";
import { SurveysHistoryMobile } from "./components/surveys-history-mobile";

export function SurveysHistoryPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Histórico de Sondagens" });

  return isDesktop ? <SurveysHistoryDesktop /> : <SurveysHistoryMobile />
}