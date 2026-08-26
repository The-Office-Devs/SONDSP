import { useState } from "react";

import type { StudentListItem } from "@/students/students.types";
import { type SurveyFormData } from "../survey-schema";
import { useStudents } from "@/students/students-page/use-students";
import { useTableState } from "@/hooks/useTableState";
import { buildPaginationProps } from "@/api/types";

import { SurveysFilterPanel } from "./surveys-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "20%" },
  { id: "registration", header: "Matrícula", width: "20%", },
  { id: "name", header: "Nome", width: "46%" }
];

export function SurveysDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);
  const [appliedFilters, setAppliedFilters] = useState<SurveyFormData | null>(null);

  const { data: studentsPage, isFetching, isLoading } = useStudents(
    {
      page,
      size,
      status: true,
      schoolClassId: appliedFilters?.schoolClassId,
      ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
    },
    { enabled: !!appliedFilters }
  );

  // [ Finalizar Sondagem ] se houver sondagem aberta, ou [ Aplicar Sondagem ] caso contrário
  const actions: RowAction<StudentListItem>[] = [
    { type: "edit", onClick: (studentItem) => /*setEditStudentId(studentItem.id)*/ null },
  ];

  const handleClear = () => {
    setAppliedFilters(null);
    setFilter("");
    setPage(0);
  };
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SurveysFilterPanel 
        onSearch={setAppliedFilters}
        onClear={handleClear} 
        isSearching={isLoading} 
      />
      
      {!appliedFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma no filtro acima para carregar a lista de alunos e iniciar as sondagens
          </p>
        </div>
      ) : (
        <>
          <FilterBar value={filter} onChange={setFilter} />

          <DataTable<StudentListItem>
            data={studentsPage?.content ?? []}
            columns={columns}
            rowKey={(studentItem) => studentItem.id}
            actions={actions}
            emptyMessage="Nenhum aluno encontrado"
            isFetching={isFetching}
            pagination={studentsPage ? buildPaginationProps(studentsPage, setPage) : undefined}
          />
        </>
      )}
    </div>
  );
}