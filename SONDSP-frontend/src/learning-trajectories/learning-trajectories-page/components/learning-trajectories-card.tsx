import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { 
  getCurrentLevel,
  getResultLabel, 
  isKnownLevel, 
  getBadgeLevelCode,
  getSurveyLevelStyle,
  NO_RESULT_DOT_CLASS,
  getActiveLegend
} from "@/lib/survey-utils";
import type { 
  LearningTrajectory, 
  LearningTrajectoryResults, 
  TrajectoryLevel 
} from "@/learning-trajectories/learning-trajectories.types";

import { ContentCard } from "@/components/Card/ContentCard";

const TITLE = "Trajetórias de Aprendizagem";

const COLUMNS: ReadonlyArray<{
  id: string;
  label: string;
  description: string;
  getLevel: (results: LearningTrajectoryResults) => TrajectoryLevel;
}> = [
  { id: "initial", label: "Inicial", description: "Sondagem inicial", getLevel: (results) => results.initial },
  { id: "fstPeriod", label: "1º Bim", description: "1º Bimestre", getLevel: (results) => results.fstPeriod },
  { id: "sndPeriod", label: "2º Bim", description: "2º Bimestre", getLevel: (results) => results.sndPeriod },
  { id: "trdPeriod", label: "3º Bim", description: "3º Bimestre", getLevel: (results) => results.trdPeriod },
  { id: "frtPeriod", label: "4º Bim", description: "4º Bimestre", getLevel: (results) => results.frtPeriod },
  { id: "current", label: "Atual", description: "Nível atual", getLevel: getCurrentLevel }
];

interface LearningTrajectoriesCardProps {
  trajectories: LearningTrajectory[];
  strandCode?: string;
  gradeLevel?: string;
  isFetching?: boolean;
}

function LevelDot({ level }: Readonly<{ level: TrajectoryLevel }>) {
  if (!isKnownLevel(level)) {
    return (
      <span title={getResultLabel(null)} className={cn("mx-auto block size-10 rounded-full", NO_RESULT_DOT_CLASS)} />
    );
  }

  const resultLabel = getResultLabel(level);
  const levelStyle = getSurveyLevelStyle(level);
  const badgeCode = getBadgeLevelCode(level);

  return (
    <span
      title={resultLabel}
      className={cn(
        "mx-auto flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold",
        levelStyle.bg,
        levelStyle.text
      )}
    >
      {badgeCode}
    </span>
  );
}

export function LearningTrajectoriesCard({
  trajectories,
  strandCode,
  gradeLevel,
  isFetching = false
}: Readonly<LearningTrajectoriesCardProps>) {
  const allResults = trajectories.flatMap((t) => [
    t.results.initial,
    t.results.fstPeriod,
    t.results.sndPeriod,
    t.results.trdPeriod,
    t.results.frtPeriod
  ]);
  const legendItems = getActiveLegend(allResults, strandCode, gradeLevel);

  const legend = (
    <>
      <p className="text-sm font-semibold text-slate-700">Legenda</p>
      <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {legendItems.map((item) => (
          <li key={item.code} title={item.label} className="flex items-center gap-1.5 text-sm text-slate-700">
            <span aria-hidden="true" className={cn("size-3 rounded-full", item.dotClass)} />
            <span>{item.label}</span>
          </li>
        ))}
        <li className="flex items-center gap-1.5 text-sm text-slate-700">
          <span aria-hidden="true" className={cn("size-3 rounded-full", NO_RESULT_DOT_CLASS)} />
          <span>{getResultLabel(null)}</span>
        </li>
      </ul>
    </>
  );

  return (
    <ContentCard
      title={TITLE}
      total={trajectories.length}
      emptyMessage="Nenhum aluno encontrado com os filtros selecionados."
      isFetching={isFetching}
      legend={legend}
    >
      <div className="max-h-[40rem] overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky top-0 z-[1] border-b border-neutral-300 bg-neutral-100 pl-2 text-left text-slate-500">
                Estudante
              </th>
              {COLUMNS.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className="sticky top-0 z-[1] w-[12%] border-b border-neutral-300 bg-neutral-100 py-2 text-center text-sm text-slate-500"
                >
                  <span aria-hidden="true"> {column.label} </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {trajectories.map(({ student, results }) => (
              <tr key={student.id}>
                <th scope="row" className="pl-2 text-left font-normal">
                  <Link
                    to={`/app-alunos/portfolio/aluno/${student.id}`}
                    state={{ from: "trajectories" }}
                    title={`Portfólio de ${student.nome}`}
                    className="font-medium text-slate-800 underline-offset-2 hover:underline"
                  >
                    {student.nome}
                  </Link>
                </th>
                {COLUMNS.map((column) => (
                  <td key={column.id} className="py-3 text-center">
                    <LevelDot level={column.getLevel(results)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContentCard>
  );
}