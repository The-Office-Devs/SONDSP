import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ClassStudents } from "@/classes/classes.types";

import { resultOptions } from "@/lib/options-utils";
import { getSurveyDotClass, NO_RESULT_DOT_CLASS } from "@/lib/survey-utils";

interface LegendItem {
  code: string;
  label: string;
  dotClass: string;
}

const SEA_LEGEND_ITEMS: LegendItem[] = [
  { code: "PS", label: "Pré-Silábica (PS)", dotClass: "bg-red-600" },
  { code: "SSVC", label: "Silábica Sem Valor Sonoro (SSVC)", dotClass: "bg-yellow-400" },
  { code: "SCVC", label: "Silábica Com Valor Sonoro (SCVC)", dotClass: "bg-orange-500" },
  { code: "SA", label: "Silábico-Alfabética (SA)", dotClass: "bg-blue-600" },
  { code: "A", label: "Alfabética (A)", dotClass: "bg-emerald-600" },
];

const NUMERIC_LEGEND_ITEMS: LegendItem[] = [
  { code: "N1", label: "Nível 1 (N1)", dotClass: "bg-red-500" },
  { code: "N2", label: "Nível 2 (N2)", dotClass: "bg-amber-500" },
  { code: "N3", label: "Nível 3 (N3)", dotClass: "bg-sky-600" },
  { code: "N4", label: "Nível 4 (N4)", dotClass: "bg-emerald-600" },
  { code: "N5", label: "Nível 5 (N5)", dotClass: "bg-purple-600" },
];

const READING_LEGEND_ITEMS: LegendItem[] = [
  { code: "AD", label: "Compreensão Adequada (AD)", dotClass: "bg-emerald-600" },
  { code: "IN", label: "Compreensão Inadequada (IN)", dotClass: "bg-amber-500" },
  { code: "NR", label: "Não Respondeu (NR)", dotClass: "bg-slate-400" },
];

function getActiveLegend(students: ClassStudents[]): LegendItem[] {
  const hasNumeric = students.some(
    (s) => s.result && (s.result.toUpperCase().startsWith("NIVEL_") || s.result.toUpperCase().startsWith("N"))
  );
  if (hasNumeric) return NUMERIC_LEGEND_ITEMS;

  const hasReading = students.some(
    (s) =>
      s.result &&
      (s.result.toUpperCase() === "ADEQUADA" ||
        s.result.toUpperCase() === "INADEQUADA" ||
        s.result.toUpperCase() === "AD" ||
        s.result.toUpperCase() === "IN" ||
        s.result.toUpperCase() === "NR")
  );
  if (hasReading) return READING_LEGEND_ITEMS;

  // Padrão oficial SME-SP: Sistema de Escrita Alfabética (SEA)
  return SEA_LEGEND_ITEMS;
}

interface ClassStudentsCardProps {
  students: ClassStudents[];
  title?: string;
  isFetching?: boolean;
}

function getResultLabel(code: string | null) {
  if (!code) return "Sem sondagem";
  return resultOptions.find((option) => option.value === code)?.label ?? code;
}

export function ClassStudentsCard({
  students,
  title = "Turma",
  isFetching = false
}: Readonly<ClassStudentsCardProps>) {
  const total = students.length;
  const legendItems = getActiveLegend(students);

  return (
    <section
      aria-label={title}
      aria-busy={isFetching}
      className="relative w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100"
    >
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Carregando dados...</span>
          </div>
        </div>
      )}

      <header className="flex items-center justify-between bg-primary px-4 py-4 text-white">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-sm font-medium">
          Total: {total} {total === 1 ? "aluno" : "alunos"}
        </span>
      </header>

      <div className="p-4">
        {total === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum aluno vinculado a esta turma.
          </p>
        ) : (
          <ul className="grid max-h-[30rem] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => {
              const resultLabel = getResultLabel(student.result);

              return (
                <li key={student.studentId}>
                  <Link
                    to={`/app-portfolio/aluno/${student.studentId}`}
                    title={`${student.studentName} (${resultLabel})`}
                    className="group flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-slate-300 hover:bg-slate-50"
                  >
                    <span 
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 rounded-full shrink-0",
                        getSurveyDotClass(student.result)
                      )}
                    />

                    <span className="truncate underline-offset-2 group-hover:underline">
                      {student.studentName}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 border-t border-neutral-300 pt-2">
          <p className="text-xs font-semibold text-slate-700">Legenda</p>
          <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {legendItems.map((item) => (
              <li
                key={item.code}
                title={item.label}
                className="flex items-center gap-1.5 text-xs text-slate-700"
              >
                <span aria-hidden="true" className={cn("size-2 rounded-full", item.dotClass)} />
                <span>{item.code}</span>
              </li>
            ))}
            <li className="flex items-center gap-1.5 text-xs text-slate-700">
              <span aria-hidden="true" className={cn("size-2 rounded-full", NO_RESULT_DOT_CLASS)} />
              <span>{getResultLabel(null)}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

