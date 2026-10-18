import { useParams } from "react-router-dom";

import { useSessionState } from "@/hooks/use-session-state";
import { useClass, useClassStudentsCard } from "@/classes/use-classes";
import { useStrand } from "@/strands/use-strands";
import type { ClassDetailsFormData } from "../class-details.schema";

import { ClassStudentsCard } from "./class-students-card";
import { ClassDetailsFilterPanel } from "./class-details-filter-panel";
import { ClassNotesCard } from "./class-notes/class-notes-card";

export function ClassDetailsDesktop() {
  const { id } = useParams();
  const classId = Number(id);

  const { data: schoolClass } = useClass(classId);
  const schoolClassName = schoolClass?.name;

  const [appliedFilters, setAppliedFilters] = useSessionState<ClassDetailsFormData | null>(
    `class-details-filter:${classId}`,
    null
  );

  const { data: students = [], isFetching } = useClassStudentsCard(classId, appliedFilters);
  const { data: currentStrand } = useStrand(appliedFilters?.strandId ?? null);

  const handleClear = () => setAppliedFilters(null);
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassDetailsFilterPanel
        initialValues={appliedFilters}
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isFetching}
        schoolClassName={schoolClassName!}
      />

      {!appliedFilters?.strandId ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione um eixo no filtro acima para carregar os dados da turma
          </p>
        </div>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-2">
          <ClassStudentsCard 
            title={schoolClassName} 
            classId={classId} 
            students={students}
            strandCode={currentStrand?.code}
            isFetching={isFetching}
          />

          <ClassNotesCard classId={classId} isFetching={isFetching} />
        </div>
      )}
    </div>
  );
}