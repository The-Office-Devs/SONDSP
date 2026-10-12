import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { resultOptions } from "@/lib/options-utils";
import { RESULT_DOT_CLASS, type SurveyResultCode } from "@/lib/survey-utils";

const LEGEND: SurveyResultCode[] = ["PS", "SV", "CV", "SA", "ALF"];

const NO_RESULT_DOT_CLASS = "bg-slate-300";

// trocar esse tipo quando o back tiver pronto
export interface ClassStudentResult {
  id: number;
  name: string;
  result: SurveyResultCode | null;
}

interface ClassStudentsCardProps {
  students: ClassStudentResult[]; // talvez alterar isso
  title?: string;
}

function getResultLabel(code: SurveyResultCode | null) {
  if (!code) return "Sem sondagem";
  return resultOptions.find((option) => option.value === code)?.label ?? code;
}

export function ClassStudentsCard({
  students,
  title = "Turma"
}: Readonly<ClassStudentsCardProps>) {
  const total = students.length;
  // estudantes ja devem vir em ordem alfabetica
  // mudar a rota que o link manda
  return (
    <section
      aria-label={title}
      className="w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100 lg:w-1/2"
    >
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
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => {
              const resultLabel = getResultLabel(student.result);

              return (
                <li key={student.id}>
                  <Link
                    to={`historico/aluno/${student.id}`}
                    title={`${student.name} (${resultLabel})`}
                    className="group flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-slate-300 hover:bg-slate-100"
                  >
                    <span 
                      aria-hidden="true"
                      className={cn(
                        "size-2.5 rounded-full",
                        student.result ? RESULT_DOT_CLASS[student.result] : NO_RESULT_DOT_CLASS
                      )}
                    />

                     <span className="truncate underline-offset-2 group-hover:underline">
                      {student.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 border-t border-neutral-300 pt-2">
          <p className="text-xs text-slate-700"> Legenda </p>
          <ul className="mt-2 flex flex-wrap gap-x-4">
            {LEGEND.map((code) => (
              <li
                key={code}
                title={getResultLabel(code)}
                className="flex items-center gap-2 text-xs text-slate-700"
              >
                <span aria-hidden="true" className={cn("size-2 rounded-full", RESULT_DOT_CLASS[code])} />
                {code}
              </li>
            ))}
            <li className="flex items-center gap-2 text-xs text-slate-700">
              <span aria-hidden="true" className={cn("size-2 rounded-full", NO_RESULT_DOT_CLASS)} />
              {getResultLabel(null)}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

