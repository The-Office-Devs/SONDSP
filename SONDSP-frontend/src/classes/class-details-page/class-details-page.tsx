import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import type { Breadcrumb } from "@/contexts/shell-context";

import { useIsDesktop } from "@/hooks/use-media-query";
import { useFooter } from "@/hooks/use-footer";
import { useClass } from "../use-classes";

import { ClassDetailsDesktop } from "./components/class-details-desktop";
import { ClassDetailsMobile } from "./components/class-details-mobile";

export function ClassDetailsPage() {
  const isDesktop = useIsDesktop();
  const navigator = useNavigate();

  const { id } = useParams<{ id: string }>();
  const classId = id ? Number(id) : null;
  const { data: schoolClass } = useClass(classId);

  const footerTitle: Breadcrumb[] = [
    { label: "Início", to: "/" },
    { label: "Turmas", to: "/app-turmas" },
    { label: schoolClass ? `Turma ${schoolClass.name}` : "Turma" },
  ];

  useFooter({ 
    title: footerTitle,
    leftAction: {
      label: "Voltar",
      icon: <ChevronLeft className="size-4" />,
      onClick: () => navigator(-1),
    }
  });

  return isDesktop ? <ClassDetailsDesktop /> : <ClassDetailsMobile />;
}