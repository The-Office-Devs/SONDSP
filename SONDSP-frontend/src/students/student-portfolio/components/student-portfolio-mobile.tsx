import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimelineSurveyItem } from "../student-portfolio.types";

import { useStudentPortfolio, useStudentTimeline } from "../use-student-portfolio";

import { StudentProfileCard } from "./student-profile-card";
import { StudentAnnotationsCard } from "./student-annotations-card";
import { StudentTimelineCard } from "./student-timeline-card";
import { ViewEvidenceDialog } from "./view-evidence-dialog";

export function StudentPortfolioMobile() {
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
      <div className="flex h-72 w-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2.5 text-slate-500">
          <Loader2 className="size-7 animate-spin text-primary" />
          <p className="text-xs font-medium">Carregando portfólio...</p>
        </div>
      </div>
    );
  }

  if (isPortfolioError || !portfolio) {
    return (
      <div className="mx-4 my-8 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-xs">
        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="size-5" />
        </div>
        <h3 className="mt-3 text-sm font-bold text-slate-900">
          Estudante não encontrado
        </h3>
        <p className="mt-1.5 text-xs text-slate-500">
          Não foi possível localizar os dados deste estudante.
        </p>
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs cursor-pointer"
          >
            <ArrowLeft className="size-3.5" />
            <span>Voltar</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 px-3.5 py-4">
      {/* Perfil Cadastral */}
      <StudentProfileCard 
        student={portfolio} 
        isFetching={isPortfolioFetching}
      />

      {/* Linha do Tempo de Sondagens */}
      <div className="min-w-0">
        <StudentTimelineCard
          studentId={portfolio.id}
          timeline={timeline}
          onViewEvidence={(survey) => setEvidenceSurvey(survey)}
          isFetching={isStudentTimelineFetching}
        />
      </div>

      {/* Anotações Pedagógicas e de Conselho */}
      <StudentAnnotationsCard 
        studentId={portfolio.id} 
        studentName={portfolio.name} 
      />

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
