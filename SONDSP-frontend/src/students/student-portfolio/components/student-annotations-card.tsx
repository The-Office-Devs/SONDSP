import { useState } from "react";
import { Check, Plus } from "lucide-react";
import {
  type AnnotationTag,
  type StudentAnnotation,
  TAG_METADATA
} from "../student-portfolio.types";

interface StudentAnnotationsCardProps {
  annotations: StudentAnnotation[];
  onNewAnnotation: () => void;
  onToggleTag: (annotationId: number, tag: AnnotationTag) => void;
}

const FILTER_OPTIONS: { id: "ALL" | AnnotationTag; label: string }[] = [
  { id: "ALL", label: "Todas" },
  { id: "CONSELHO", label: "Conselho" },
  { id: "PEDAGOGICA", label: "Pedagógica" },
  { id: "RESPONSAVEIS", label: "Responsáveis" }
];

export function StudentAnnotationsCard({
  annotations,
  onNewAnnotation,
  onToggleTag
}: Readonly<StudentAnnotationsCardProps>) {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | AnnotationTag>("ALL");

  const filteredAnnotations = annotations.filter((ann) => {
    if (selectedFilter === "ALL") return true;
    return ann.tags.includes(selectedFilter);
  });

  return (
    <section 
      aria-label="Anotações do Estudante"
      className="overflow-hidden rounded-xl border border-neutral-300 bg-white shadow-xs"
    >
      <header className="flex items-center justify-between bg-primary px-6 py-4 text-white">
        <h2 className="text-base font-bold tracking-wide">Anotações</h2>

        <button
          type="button"
          onClick={onNewAnnotation}
          className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-slate-800 shadow-xs transition hover:bg-slate-100 cursor-pointer"
        >
          <Plus className="size-3.5 stroke-[2.5]" />
          <span>Nova Anotação</span>
        </button>
      </header>

      <div className="p-6">
        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          {FILTER_OPTIONS.map((filter) => {
            const isActive = selectedFilter === filter.id;

            if (filter.id === "ALL") {
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedFilter("ALL")}
                  className={`rounded-full px-4 py-1 text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? "bg-[#002856] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {filter.label}
                </button>
              );
            }

            const meta = TAG_METADATA[filter.id];
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedFilter(filter.id)}
                className={`rounded-full border px-3.5 py-1 text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "ring-2 ring-primary " + meta.filterClass
                    : meta.filterClass
                }`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>

        {/* Listagem de Anotações */}
        {filteredAnnotations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma anotação encontrada para a categoria selecionada.
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredAnnotations.map((annotation) => {
              const isCP = annotation.authorName.startsWith("CP");

              return (
                <article
                  key={annotation.id}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs transition hover:border-slate-300"
                >
                  {/* Cabeçalho da anotação */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2.5 py-0.5 text-xs font-bold ${
                          isCP
                            ? "bg-[#f5e8fc] text-[#9333ea]"
                            : "bg-[#e0f2fe] text-[#0284c7]"
                        }`}
                      >
                        {annotation.authorName}
                      </span>
                      <time className="text-xs text-slate-400 font-normal">
                        {annotation.date}
                      </time>
                    </div>

                    {/* Tags da anotação no canto direito */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {annotation.tags.map((tag) => {
                        const meta = TAG_METADATA[tag];
                        return (
                          <span
                            key={tag}
                            className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.chipClass}`}
                          >
                            {meta.label}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Texto */}
                  <p className="mt-2.5 text-xs leading-relaxed text-slate-700 font-normal">
                    {annotation.text}
                  </p>

                  <hr className="my-2.5 border-neutral-200" />

                  {/* Toggles Interativos Rápidos */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {(["CONSELHO", "PEDAGOGICA", "RESPONSAVEIS"] as AnnotationTag[]).map(
                      (tagKey) => {
                        const meta = TAG_METADATA[tagKey];
                        const isMarked = annotation.tags.includes(tagKey);

                        return (
                          <button
                            key={tagKey}
                            type="button"
                            onClick={() => onToggleTag(annotation.id, tagKey)}
                            title={isMarked ? `Remover categoria ${meta.label}` : `Marcar como ${meta.label}`}
                            className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                              isMarked
                                ? meta.toggleActiveClass
                                : meta.toggleInactiveClass
                            }`}
                          >
                            {isMarked ? (
                              <>
                                <Check className="size-3 stroke-[2.5]" />
                                <span>{meta.label}</span>
                              </>
                            ) : (
                              <span>Marcar {meta.label}</span>
                            )}
                          </button>
                        );
                      }
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
