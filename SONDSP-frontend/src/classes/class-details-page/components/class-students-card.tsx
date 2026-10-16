import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import type { ClassStudents } from "@/classes/classes.types";
import { getResultLabel, getSurveyDotClass, NO_RESULT_DOT_CLASS, getActiveLegend } from "@/lib/survey-utils";

interface ClassStudentsCardProps {
  students: ClassStudents[];
  title?: string;
  strandCode?: string;
  isFetching?: boolean;
}

export function ClassStudentsCard({
  students,
  title = "Turma",
  strandCode,
  isFetching = false
}: Readonly<ClassStudentsCardProps>) {
  const total = students.length;
  const legendItems = getActiveLegend(students.map((s) => s.result), strandCode);

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
                <span>{item.label}</span>
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
