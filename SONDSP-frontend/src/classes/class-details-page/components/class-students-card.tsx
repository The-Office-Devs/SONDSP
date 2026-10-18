import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import type { ClassStudents } from "@/classes/classes.types";
import { getResultLabel, getSurveyDotClass, NO_RESULT_DOT_CLASS, getActiveLegend } from "@/lib/survey-utils";
import { ContentCard } from "@/components/Card/ContentCard";

interface ClassStudentsCardProps {
  students: ClassStudents[];
  classId: number
  title?: string;
  strandCode?: string;
  gradeLevel?: string;
  isFetching?: boolean;
}

export function ClassStudentsCard({
  students,
  classId,
  title = "Turma",
  strandCode,
  gradeLevel,
  isFetching = false
}: Readonly<ClassStudentsCardProps>) {
  const total = students.length;
  const legendItems = getActiveLegend(students.map((s) => s.result), strandCode, gradeLevel);

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
      title={title}
      headerRight={`Total: ${total} ${total === 1 ? "aluno" : "alunos"}`}
      total={total}
      emptyMessage="Nenhum aluno vinculado a esta turma."
      isFetching={isFetching}
      legend={legend}
    >
      <ul className="grid max-h-[30rem] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 xl:grid-cols-3">
        {students.map((student) => {
          const resultLabel = getResultLabel(student.result);

          return (
            <li key={student.studentId}>
              <Link
                to={`/app-alunos/portfolio/aluno/${student.studentId}`}
                state={{
                  from: "class",
                  schoolClassId: classId,
                  schoolClassName: title,
                }}
                title={`${student.studentName} (${resultLabel})`}
                className="group flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm hover:border-slate-300 hover:bg-slate-50"
              >
                <span
                  aria-hidden="true"
                  className={cn("size-3 shrink-0 rounded-full", getSurveyDotClass(student.result))}
                />
                <span className="truncate underline-offset-2 group-hover:underline">
                  {student.studentName}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </ContentCard>
  );
}
