import { useState } from "react";
import type { ClassDetailsFormData } from "../class-details.schema";
import { useParams } from "react-router-dom";
import { ClassDetailsFilterPanel } from "./class-details-filter-panel";
import { ClassStudentsCard, type ClassStudentResult } from "./class-students-card";
import { useClass } from "@/classes/classes-page/use-classes";

export const mockClassStudents: ClassStudentResult[] = [
  { id: 1, name: "Ana Beatriz Silva", result: "PS" },
  { id: 2, name: "Bruno Oliveira", result: "SV" },
  { id: 3, name: "Carla Mendes", result: "SA" },
  { id: 4, name: "Daniel Santos", result: "ALF" },
  { id: 5, name: "Júlio da Silva", result: "CV" },
  { id: 6, name: "Larissa Ferreira", result: "CV" },
  { id: 7, name: "Lucas Almeida", result: "PS" },
  { id: 8, name: "Mariana Costa", result: "SV" },
  { id: 9, name: "Matheus Henrique", result: "SA" },
  { id: 10, name: "Nicolas Ferro", result: "ALF" },
  //{ id: 11, name: "Samara Júnior", result: "CV" },
  //{ id: 12, name: "Tomás Silva", result: "CV" },
  //{ id: 13, name: "Lucas Almeida", result: "PS" },
  //{ id: 14, name: "Mariana Costa", result: null },
  //{ id: 15, name: "Matheus Henrique", result: "SA" },
  //{ id: 16, name: "Nicolas Ferro", result: "ALF" },
  //{ id: 17, name: "Samara Júnior", result: "CV" },
  //{ id: 18, name: "Tomás Silva", result: "CV" },
  //{ id: 19, name: "Tomás Silva", result: "CV" },
  //{ id: 20, name: "Tomás Silva", result: "CV" },
  //{ id: 21, name: "Tomás Silva", result: "CV" },
  //{ id: 22, name: "Tomás Silva", result: "CV" },
  //{ id: 23, name: "Tomás Silva", result: "CV" },
  //{ id: 24, name: "Tomás Silva", result: "CV" },
];

export function ClassDetailsDesktop() {
  const { id } = useParams();
  const classId = Number(id);

  const { data: schoolClass } = useClass(classId);
  const schoolClassName = schoolClass?.name;

  /*const { page, setPage, size } = useTableState(5);*/
  const [appliedFilters, setAppliedFilters] = useState<ClassDetailsFormData | null>(null);
  const isLoading = false; // deve ser o da chamada

  /*const { data: surveysPage, isFetching, isLoading } = useStudentSurveys(
      studentId,
      {
        page,
        size,
        ...(appliedFilters?.status != null ? { status: appliedFilters.status } : {}),
        ...(appliedFilters?.strandId ? { strandId: appliedFilters.strandId } : {}),
        ...(appliedFilters?.bimester ? { bimester: appliedFilters.bimester } : {})
      }
    );*/

  const handleClear = () => {
    setAppliedFilters(null);
    // ver como tratar 
    //setPage(0);
  };
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassDetailsFilterPanel
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isLoading}
        schoolClassName={schoolClassName!}
      />

      {!appliedFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione um eixo no filtro acima para carregar os dados da turma
          </p>
        </div>
      ) : (
        <>
          <ClassStudentsCard title={schoolClassName} students={mockClassStudents} />
        </>
      )}
    </div>
  )
}