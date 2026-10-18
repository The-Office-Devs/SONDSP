import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineSurveyItem } from "../student-portfolio.types";
import type { PortfolioNavState } from "../student-portfolio-page";

import {
  useStudentPortfolio,
  useStudentTimeline,
} from "../use-student-portfolio";

import { StudentProfileCard } from "./student-profile-card";
import { StudentAnnotationsCard } from "./student-annotations-card";
import { StudentTimelineCard } from "./student-timeline-card";
import { ViewEvidenceDialog } from "./view-evidence-dialog";

interface StudentPortfolioDesktopProps {
  portfolioNavState?: PortfolioNavState;
}

export function StudentPortfolioDesktop({ portfolioNavState }: StudentPortfolioDesktopProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = id ? Number(id) : null;

  // Consultas aos endpoints do back-end
  const {
    data: portfolio,
    isLoading: isPortfolioLoading,
    isFetching: isPortfolioFetching,
    isError: isPortfolioError,
  } = useStudentPortfolio(studentId);

  const {
    data: timeline = [],
    isFetching: isStudentTimelineFetching
  } = useStudentTimeline(studentId);

  const [evidenceSurvey, setEvidenceSurvey] = useState<TimelineSurveyItem | null>(null);

  if (isPortfolioLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium">Carregando portfólio do estudante...</p>
        </div>
      </div>
    );
  }

  if (isPortfolioError || !portfolio) {
    return (
      <div className="mx-auto my-12 max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-xs">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="size-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-slate-900">
          Estudante não encontrado
        </h3>
        <p className="mt-2 text-xs text-slate-500">
          Não foi possível localizar os dados deste estudante ou o identificador informado é inválido.
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Voltar à tela anterior</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-4">
      {/* Grid Principal de 2 Colunas */}
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-5">
        {/* Coluna Esquerda: Perfil e Anotações (~40% de proporção visual) */}
        <div className="space-y-4">
          <StudentProfileCard 
            student={portfolio} 
            isFetching={isPortfolioFetching} 
          />

          <StudentAnnotationsCard 
            studentId={portfolio.id} 
            studentName={portfolio.name} 
          />
        </div>

        {/* Coluna Direita: Linha do Tempo de Sondagens (~60% de proporção visual) */}
        <div className="min-w-0">
          <StudentTimelineCard
            studentId={portfolio.id}
            portfolioNavState={portfolioNavState}
            timeline={timeline}
            onViewEvidence={(survey) => setEvidenceSurvey(survey)}
            isFetching={isStudentTimelineFetching}
          />
        </div>
      </div>

      {/* Modal Visualizar Evidência */}
      <ViewEvidenceDialog
        open={Boolean(evidenceSurvey)}
        survey={evidenceSurvey}
        onOpenChange={(open) => {
          if (!open) setEvidenceSurvey(null);
        }}
      />
    </div>
  );
}
