import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { 
  getResultLabel, 
  isKnownLevel, 
  LEGEND, 
  NO_RESULT_DOT_CLASS, 
  RESULT_DOT_CLASS 
} from "@/lib/survey-utils";
import type { 
  LearningTrajectoryStudent, 
  TrajectoryLevel 
} from "@/learning-trajectories/learning-trajectories.types";

const TITLE = "Trajetórias de Aprendizagem";

type TrajectoryColumnKey = Exclude<keyof LearningTrajectoryStudent, "studentId" | "studentName">;

const COLUMNS: ReadonlyArray<{ key: TrajectoryColumnKey; label: string; description: string }> = [
  { key: "initial", label: "Inicial", description: "Sondagem inicial" },
  { key: "firstBimester", label: "1º Bim", description: "1º Bimestre" },
  { key: "secondBimester", label: "2º Bim", description: "2º Bimestre" },
  { key: "thirdBimester", label: "3º Bim", description: "3º Bimestre" },
  { key: "fourthBimester", label: "4º Bim", description: "4º Bimestre" },
  { key: "currentLevel", label: "Atual", description: "Nível atual" }
];

interface LearningTrajectoriesCardProps {
  students: LearningTrajectoryStudent[];
  isFetching?: boolean;
}

function LevelDot({ level }: Readonly<{ level: TrajectoryLevel }>) {
  if (!isKnownLevel(level)) {
    return (
      <span title={getResultLabel(null)} className={cn("mx-auto block size-8 rounded-full", NO_RESULT_DOT_CLASS)} />
    );
  }

  const resultLabel = getResultLabel(level);
  return (
    <span
      title={resultLabel}
      className={cn(
        "mx-auto flex size-8 items-center justify-center rounded-full text-[10px] font-semibold text-white",
        RESULT_DOT_CLASS[level]
      )}
    >
      {level}
    </span>
  );
}

export function LearningTrajectoriesCard({
  students,
  isFetching = false
}: Readonly<LearningTrajectoriesCardProps>) {
  // TODO: Checar se a rota do Link esta correta
  return (
    <section
      aria-label={TITLE}
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
        <h2 className="text-sm font-semibold">{TITLE}</h2>
      </header>

      <div className="p-4">
        {students.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum aluno encontrado com os filtros selecionados.
          </p>
        ) : (
          <div className="max-h-[40rem] overflow-auto">
            <table className="w-full border-separate border-spacing-0 text-sm">
              <thead>
                <tr>
                  <th scope="col" className="sticky top-0 z-[1] border-b border-neutral-300 bg-neutral-100 pl-2 text-left text-slate-500">
                    Estudante
                  </th>
                  {COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      scope="col"
                      className="sticky top-0 z-[1] w-[12%] border-b border-neutral-300 bg-neutral-100 py-2 text-center text-xs text-slate-500"
                    >
                      <span aria-hidden="true">{column.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <th scope="row" className="pl-2 text-left font-normal">
                      <Link
                        to={`/app-alunos/aluno/${student.studentId}`}
                        title={student.studentName}
                        className="underline-offset-2 hover:underline"
                      >
                        {student.studentName}
                      </Link>
                    </th>
                    {COLUMNS.map((column) => (
                      <td key={column.key} className="py-3 text-center">
                        <LevelDot level={student[column.key]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-2 border-t border-neutral-300 pt-2">
          <p className="text-sm text-slate-700"> Legenda </p>
          <ul className="mt-2 flex flex-wrap gap-x-4">
            {LEGEND.map((code) => (
              <li
                key={code}
                title={getResultLabel(code)}
                className="flex items-center gap-2 text-sm text-slate-700"
              >
                <span aria-hidden="true" className={cn("size-2 rounded-full", RESULT_DOT_CLASS[code])} />
                {code}
              </li>
            ))}
            <li className="flex items-center gap-2 text-sm text-slate-700">
              <span aria-hidden="true" className={cn("size-2 rounded-full", NO_RESULT_DOT_CLASS)} />
              {getResultLabel(null)}
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}