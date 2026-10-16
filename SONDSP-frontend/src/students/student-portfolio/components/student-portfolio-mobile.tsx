import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AnnotationTag,
  TimelineSurveyItem,
} from "../student-portfolio.types";

import {
  useStudentPortfolio,
  useStudentTimeline,
  useStudentAnnotations,
  useCreateStudentAnnotation,
  useUpdateStudentAnnotationTags,
} from "../use-student-portfolio";

import { StudentProfileCard } from "./student-profile-card";
import { StudentAnnotationsCard } from "./student-annotations-card";
import { StudentTimelineCard } from "./student-timeline-card";
import { NewAnnotationDialog } from "./new-annotation-dialog";
import { ViewEvidenceDialog } from "./view-evidence-dialog";

export function StudentPortfolioMobile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const studentId = id ? Number(id) : null;

  // Consultas aos endpoints do back-end
  const {
    data: portfolio,
    isLoading: isPortfolioLoading,
    isError: isPortfolioError,
  } = useStudentPortfolio(studentId);

  const {
    data: timeline = [],
  } = useStudentTimeline(studentId);

  const {
    data: annotationsPage,
  } = useStudentAnnotations(studentId);

  // Mutações
  const { mutate: createAnnotation } = useCreateStudentAnnotation(studentId ?? 0);
  const { mutate: updateTags } = useUpdateStudentAnnotationTags(studentId ?? 0);

  // Estados dos modais
  const [isNewAnnotationOpen, setIsNewAnnotationOpen] = useState(false);
  const [evidenceSurvey, setEvidenceSurvey] = useState<TimelineSurveyItem | null>(null);

  const annotations = annotationsPage?.content ?? [];

  // Alternância de categoria diretamente pelos toggles no card
  const handleToggleTag = (annotationId: number, tag: AnnotationTag) => {
    const target = annotations.find((ann) => ann.id === annotationId);
    if (!target) return;
    const hasTag = target.tags.includes(tag);
    const updatedTags = hasTag
      ? target.tags.filter((t) => t !== tag)
      : [...target.tags, tag];

    updateTags({ annotationId, tags: updatedTags });
  };

  // Criação de nova anotação
  const handleSaveNewAnnotation = (text: string, tags: AnnotationTag[]) => {
    createAnnotation({ text, tags });
  };

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
      <StudentProfileCard student={portfolio} />

      {/* Linha do Tempo de Sondagens */}
      <div className="min-w-0">
        <StudentTimelineCard
          studentId={portfolio.id}
          timeline={timeline}
          onViewEvidence={(survey) => setEvidenceSurvey(survey)}
        />
      </div>

      {/* Anotações Pedagógicas e de Conselho */}
      <StudentAnnotationsCard
        annotations={annotations}
        onNewAnnotation={() => setIsNewAnnotationOpen(true)}
        onToggleTag={handleToggleTag}
      />

      {/* Modal Nova Anotação */}
      <NewAnnotationDialog
        open={isNewAnnotationOpen}
        studentName={portfolio.name}
        onOpenChange={setIsNewAnnotationOpen}
        onSave={handleSaveNewAnnotation}
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
