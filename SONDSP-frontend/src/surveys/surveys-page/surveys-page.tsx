import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { SurveysDesktop } from "./components/surveys-desktop";
import { SurveysMobile } from "./components/surveys-mobile";

export function SurveysPage() {
  const isDesktop = useIsDesktop();

  useFooter({ title: "Sondagens" });

  return isDesktop ? <SurveysDesktop /> : <SurveysMobile />
}