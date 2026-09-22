
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { SurveysHistoryDesktop } from "./components/surveys-history-desktop";
import { SurveysHistoryMobile } from "./components/surveys-history-mobile";

export function SurveysHistoryPage() {
  const isDesktop = useIsDesktop();
  const navigator = useNavigate();

  useFooter({
    title: "Histórico de Sondagens",
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigator(-1),
    },
  });

  return isDesktop ? <SurveysHistoryDesktop /> : <SurveysHistoryMobile />
}