import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";

import { useStudentPortfolio } from "./use-student-portfolio";
import { StudentPortfolioDesktop } from "./components/student-portfolio-desktop";
import { StudentPortfolioMobile } from "./components/student-portfolio-mobile";

export function StudentPortfolioPage() {
  const { id } = useParams<{ id: string }>();
  const studentId = id ? Number(id) : null;
  const { data: portfolio } = useStudentPortfolio(studentId);

  const isDesktop = useIsDesktop();
  const navigate = useNavigate();

  const footerTitle = portfolio
    ? `Início > ${portfolio.schoolYear} > ${portfolio.school} > ${portfolio.currentClass} > Mapa de Classe > Portfólio de ${portfolio.name}`
    : "Início > Mapa de Classe > Portfólio do Estudante";

  useFooter({
    title: footerTitle,
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigate(-1),
    },
  });

  return isDesktop ? <StudentPortfolioDesktop /> : <StudentPortfolioMobile />;
}
