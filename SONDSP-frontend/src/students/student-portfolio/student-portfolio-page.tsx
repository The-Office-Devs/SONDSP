import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import type { Breadcrumb } from "@/contexts/shell-context";
import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { useStudentPortfolio } from "./use-student-portfolio";
import { StudentPortfolioDesktop } from "./components/student-portfolio-desktop";
import { StudentPortfolioMobile } from "./components/student-portfolio-mobile";

export type PortfolioNavState = {
  from?: "class" | "trajectories";
  schoolClassId?: number;
  schoolClassName?: string;
};

export function StudentPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = id ? Number(id) : null;
  const { data: portfolio } = useStudentPortfolio(studentId);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state ?? {}) as PortfolioNavState;

  const footerTitle: Breadcrumb[] =
    navState.from === "class"
      ? [
          { label: "Início", to: "/" },
          { label: "Turmas", to: "/app-turmas" },
          {
            label: `Turma ${navState.schoolClassName ?? ""}`,
            to: navState.schoolClassId ? `/app-turmas/turma/${navState.schoolClassId}` : undefined,
          },
          { label: `Portfólio de ${portfolio?.name ?? "Estudante"}` },
        ]
      : navState.from === "trajectories"
        ? [
            { label: "Trajetórias de Aprendizagem", to: "/app-trajetorias-aprendizagem" },
            { label: `Portfólio de ${portfolio?.name ?? "Estudante"}`},
          ]
        : [
            { label: "Alunos", to: "/app-alunos" },
            { label: `Portfólio de ${portfolio?.name ?? "Estudante"}` },
          ];

  useFooter({
    title: footerTitle,
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigate(-1),
    },
  });

  return isDesktop ? (
    <StudentPortfolioDesktop portfolioNavState={navState} />
  ) : (
    <StudentPortfolioMobile />
  );
}
