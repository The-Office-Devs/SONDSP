
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";
import { useStudent } from "@/students/students-page/use-students";

import { SurveysHistoryDesktop } from "./components/surveys-history-desktop";
import { SurveysHistoryMobile } from "./components/surveys-history-mobile";
import type { Breadcrumb } from "@/contexts/shell-context";

export function SurveysHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = id ? Number(id) : null;
  const { data: student } = useStudent(studentId);

  const isDesktop = useIsDesktop();
  const navigator = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as { trail?: Breadcrumb[] };
  const hasTrail = Boolean(navState.trail?.length);

  const lastCrumb: Breadcrumb = {
    label: hasTrail
      ? "Histórico de Sondagens"
      : student
        ? `Histórico de Sondagens de ${student.name}`
        : "Histórico de Sondagens",
  };

  const footerTitle: Breadcrumb[] = hasTrail
    ? [...navState.trail!, lastCrumb]
    : [{ label: "Sondagens", to: "/app-sondagens" }, lastCrumb];

  useFooter({
    title: footerTitle,
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigator(-1),
    },
  });

  return isDesktop ? <SurveysHistoryDesktop /> : <SurveysHistoryMobile />
}