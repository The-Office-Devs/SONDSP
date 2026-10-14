import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { ClassDetailsDesktop } from "./components/class-details-desktop";
import { ClassDetailsMobile } from "./components/class-details-mobile";

export function ClassDetailsPage() {
  const isDesktop = useIsDesktop();
  const navigator = useNavigate();

  useFooter({ 
    title: "Turma",
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigator(-1),
    }
  });

  return isDesktop ? <ClassDetailsDesktop /> : <ClassDetailsMobile />;
}