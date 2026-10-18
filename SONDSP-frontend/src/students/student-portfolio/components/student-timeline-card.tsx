import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pencil,
  BookOpen,
  Calculator,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  ClipboardList,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PortfolioNavState } from "../student-portfolio-page";
import type { TimelineSurveyItem } from "../student-portfolio.types";
import {
  getSurveyLevelStyle,
  getBadgeLevelCode,
  formatSurveyLevelLabel,
  formatEvolutionText
} from "@/lib/survey-utils";
import { useShell } from "@/hooks/use-shell";
import { ContentCard } from "@/components/Card/ContentCard";

interface StudentTimelineCardProps {
  studentId?: number;
  portfolioNavState?: PortfolioNavState;
  timeline: TimelineSurveyItem[];
  onViewEvidence: (survey: TimelineSurveyItem) => void;
  isFetching?: boolean;
}

const TIMELINE_PAGE_SIZE = 4;

type StrandFilterType = "TODOS" | "escrita" | "leitura" | "matematica";

const STRAND_FILTERS: { id: StrandFilterType; label: string }[] = [
  { id: "TODOS", label: "Todos os Eixos" },
  { id: "escrita", label: "Escrita" },
  { id: "leitura", label: "Leitura" },
  { id: "matematica", label: "Matemática" },
];

function getStrandIcon(strandKey: string) {
  switch (strandKey.toLowerCase()) {
    case "leitura":
      return <BookOpen className="size-4 text-slate-800" />;
    case "matematica":
      return <Calculator className="size-4 text-slate-800" />;
    case "escrita":
    default:
      return <Pencil className="size-4 text-slate-800" />;
  }
}

export function StudentTimelineCard({
  studentId,
  portfolioNavState,
  timeline,
  onViewEvidence,
  isFetching
}: Readonly<StudentTimelineCardProps>) {
  const navigate = useNavigate();
  const { footer } = useShell();
  const [selectedStrand, setSelectedStrand] = useState<StrandFilterType>("TODOS");
  const [timelinePage, setTimelinePage] = useState(0);

  const filteredTimeline = timeline.filter((item) => {
    if (selectedStrand === "TODOS") return true;
    return item.strandKey.toLowerCase() === selectedStrand;
  });

  const totalItems = filteredTimeline.length;
  const totalPages = Math.ceil(totalItems / TIMELINE_PAGE_SIZE);
  const paginatedTimeline = filteredTimeline.slice(
    timelinePage * TIMELINE_PAGE_SIZE,
    (timelinePage + 1) * TIMELINE_PAGE_SIZE
  );

  const changeStrand = (value: StrandFilterType) => {
    setSelectedStrand((prev) => (prev === value ? "TODOS" : value));
    setTimelinePage(0);
  };

  const openHistory = () => {
    if (!studentId) return;

    const currentTrail = Array.isArray(footer.title)
      ? footer.title.map((crumb, i, arr) =>
        i === arr.length - 1
          ? {
            ...crumb,
            to: `/app-alunos/portfolio/aluno/${studentId}`,
            state: portfolioNavState,
          }
          : crumb,
      )
      : [];

    navigate(`/app-sondagens/historico/aluno/${studentId}`, {
      state: { trail: currentTrail },
    });
  };

  return (
    <ContentCard
      title="Linha do Tempo de Sondagens"
      headerClassName="py-2.5 px-4"
      contentClassName="p-3 sm:p-4"
      headerRight={
        studentId ? (
          <button
            type="button"
            onClick={openHistory}
            className="flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-white hover:underline transition cursor-pointer"
            title="Acessar histórico completo de avaliações do aluno"
          >
            <span>Ver Histórico Completo</span>
            <ChevronRight className="size-4" />
          </button>
        ) : undefined
      }
      toolbar={
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-300 px-4 py-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-1.5 text-sm font-semibold text-slate-500">
              <Filter className="size-4 text-slate-400" />
              <span>Filtrar eixo:</span>
            </div>
            {STRAND_FILTERS.map((filter) => {
              const isActive = selectedStrand === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => changeStrand(filter.id)}
                  className={cn(
                    "cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition",
                    isActive
                      ? "bg-primary text-white"
                      : "bg-white text-primary ring-1 ring-inset ring-primary/20 hover:brightness-95"
                  )}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {totalItems > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 sm:ml-auto">
              <span>
                <strong>{timelinePage * TIMELINE_PAGE_SIZE + 1}–{Math.min((timelinePage + 1) * TIMELINE_PAGE_SIZE, totalItems)}</strong> de <strong>{totalItems}</strong>
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label="Página anterior da linha do tempo"
                    title="Página anterior"
                    disabled={timelinePage === 0}
                    onClick={() => setTimelinePage((p) => Math.max(0, p - 1))}
                    className="flex size-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Próxima página da linha do tempo"
                    title="Próxima página"
                    disabled={timelinePage >= totalPages - 1}
                    onClick={() => setTimelinePage((p) => Math.min(totalPages - 1, p + 1))}
                    className="flex size-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      }
      isFetching={isFetching}
    >
      {filteredTimeline.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
          <ClipboardList className="mb-2 size-10 stroke-1 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">Nenhuma sondagem registrada para este filtro</p>
          <p className="mt-1 max-w-sm text-xs text-slate-400">
            As avaliações e sondagens aplicadas a este estudante aparecerão cronologicamente nesta linha do tempo.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          <div className="relative space-y-3.5 py-1">
            {/* Linha vertical conectora contínua centralizada nos nós */}
            <div
              className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-neutral-300"
              aria-hidden="true"
            />

            {paginatedTimeline.map((item) => {
              const displayLevelCode = getBadgeLevelCode(item.levelCode);
              const isLongCode = displayLevelCode.length >= 4;
              const prevEvolutionCode = getBadgeLevelCode(item.evolution?.previousCode);
              const currEvolutionCode = getBadgeLevelCode(item.evolution?.currentCode);

              const prevLevelLabel = formatSurveyLevelLabel(item.evolution?.previousCode);
              const currLevelLabel = formatSurveyLevelLabel(item.evolution?.currentCode ?? item.levelCode);
              const evolutionText = formatEvolutionText(item.evolution);

              const levelStyle = getSurveyLevelStyle(item.levelCode);
              const prevLevelStyle = getSurveyLevelStyle(item.evolution?.previousCode);
              const currLevelStyle = getSurveyLevelStyle(item.evolution?.currentCode ?? item.levelCode);

              return (
                <div key={item.id} className="relative flex items-start gap-4">
                  {/* Nó circular na linha do tempo */}
                  <div
                    aria-label={`Nível ${item.levelCode}`}
                    className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full font-bold shadow-xs ${isLongCode ? "text-[10px] tracking-tight px-0.5 text-center" : "text-xs"
                      } ${levelStyle.bg} ${levelStyle.text}`}
                  >
                    {displayLevelCode}
                  </div>

                  {/* Card da Sondagem */}
                  <article className="flex-1 rounded-xl border border-neutral-200 bg-white p-3.5 lg:p-4 shadow-xs transition hover:border-slate-300 hover:shadow-sm space-y-2.5">
                    {/* Cabeçalho do Card */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        {getStrandIcon(item.strandKey)}
                        <span className="font-bold text-slate-800">{item.strand}</span>
                        <span className="font-bold text-slate-400">•</span>
                        <span className="font-medium text-slate-600">{item.bimester}</span>
                        <time className="text-slate-400 font-normal">({item.date})</time>
                      </div>

                      {/* Gatilho "Ver Evidência" */}
                      <button
                        type="button"
                        onClick={() => onViewEvidence(item)}
                        className="flex items-center gap-1 text-xs font-bold text-[#002856] transition hover:underline cursor-pointer"
                      >
                        <span>Ver evidência</span>
                        <ChevronRight className="size-4 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Nível Atual e Subtítulo */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`rounded-full px-3 py-0.5 text-xs font-bold shadow-2xs ${levelStyle.bg} ${levelStyle.text}`}
                      >
                        {item.levelLabel}
                      </span>
                      <span className="text-xs sm:text-sm font-normal text-slate-700">{item.activityTitle}</span>
                    </div>

                    {/* Capacidades Específicas de Leitura (Diretriz SME-SP 3.1.B) */}
                    {item.readingCapacities && item.readingCapacities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="mr-0.5 text-[11px] font-semibold text-slate-500">Capacidades:</span>
                        {item.readingCapacities.map((cap) => (
                          <span
                            key={cap.capacity}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${cap.status === "ADEQUADA"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : cap.status === "INADEQUADA"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                          >
                            {cap.capacity}: <strong>{cap.statusLabel}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Situações-Problema de Matemática (Diretriz SME-SP 3.1.C.2) */}
                    {item.mathProblems && item.mathProblems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="mr-0.5 text-[11px] font-semibold text-slate-500">Problemas:</span>
                        {item.mathProblems.map((prob) => (
                          <span
                            key={prob.problemNumber}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${prob.status === "ACERTOU"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : prob.status === "ACERTOU_PARCIALMENTE"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                          >
                            {prob.description}: <strong>{prob.statusLabel}</strong>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Indicador de Trajetória / Evolução (Diretriz SME-SP 3.3 - Sem rotulagem punitiva) */}
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-semibold text-slate-700">Trajetória:</span>

                      {item.evolution.hasEvolution ? (
                        <div className="flex items-center gap-2">
                          <span
                            title={prevLevelLabel ? `Nível anterior: ${prevLevelLabel}` : undefined}
                            className={`flex min-w-5 h-5 px-1 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs ${prevEvolutionCode.length > 3 ? "text-[9px] tracking-tighter" : ""
                              } ${prevLevelStyle.bg} ${prevLevelStyle.text}`}
                          >
                            {prevEvolutionCode}
                          </span>

                          <ArrowRight className="size-3 text-slate-400" />

                          <span
                            title={currLevelLabel ? `Nível atual: ${currLevelLabel}` : undefined}
                            className={`flex min-w-5 h-5 px-1 items-center justify-center rounded-full text-[10px] font-bold shadow-2xs ${currEvolutionCode.length > 3 ? "text-[9px] tracking-tighter" : ""
                              } ${currLevelStyle.bg} ${currLevelStyle.text}`}
                          >
                            {currEvolutionCode}
                          </span>

                          {evolutionText && (
                            <span className="ml-1 text-xs font-medium text-slate-500">({evolutionText})</span>
                          )}
                        </div>
                      ) : (
                        <span className="font-normal text-slate-500">
                          {evolutionText || "Sem registro anterior no eixo"}
                        </span>
                      )}
                    </div>

                    {/* Observações Qualitativas do Professor */}
                    {item.notes && (
                      <p className="text-xs leading-relaxed font-normal text-slate-600 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ContentCard>
  );
}