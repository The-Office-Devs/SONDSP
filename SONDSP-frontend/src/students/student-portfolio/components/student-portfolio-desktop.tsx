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

export function StudentPortfolioDesktop() {
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
    <div className="w-full px-6 lg:px-8 xl:px-10 py-6 max-w-[1680px] mx-auto">
      {/* Grid Principal de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-[460px_1fr] xl:grid-cols-[480px_1fr] gap-6 lg:gap-8 items-start">
        {/* Coluna Esquerda: Perfil e Anotações (~40% de proporção visual) */}
        <div className="space-y-6">
          <StudentProfileCard student={portfolio} />

          <StudentAnnotationsCard
            annotations={annotations}
            onNewAnnotation={() => setIsNewAnnotationOpen(true)}
            onToggleTag={handleToggleTag}
          />
        </div>

        {/* Coluna Direita: Linha do Tempo de Sondagens (~60% de proporção visual) */}
        <div className="min-w-0">
          <StudentTimelineCard
            studentId={portfolio.id}
            timeline={timeline}
            onViewEvidence={(survey) => setEvidenceSurvey(survey)}
          />
        </div>
      </div>

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
