import { useState } from "react";

import type { StudentListItem } from "@/students/students.types";
import { type SurveyFormData } from "../survey-schema";
import { useStudents } from "@/students/students-page/use-students";
import { useTableState } from "@/hooks/use-table-state";
import { useNavigate } from "react-router-dom";
import { buildPaginationProps } from "@/api/types";

import { SurveysFilterPanel } from "./surveys-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { CreateSurveyDialog } from "@/components/Dialog/CreateSurveyDialog";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "10%" },
  { id: "registration", header: "Matrícula", width: "10%", },
  { id: "name", header: "Nome", width: "40%" }
];

export function SurveysDesktop() {
  const navigator = useNavigate();
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);
  const [appliedFilters, setAppliedFilters] = useState<SurveyFormData | null>(null);
  const [applyStudentId, setApplyStudentId] = useState<number | null>(null);

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

  const actions: RowAction<StudentListItem>[] = [
    { type: "create", label: "Criar", onClick: (studentItem) => setApplyStudentId(studentItem.id) },
    { type: "list", label: "Listar", onClick: (studentItem) => goToListar(studentItem.id) },
  ];

  const goToListar = (studentId: number) => navigator(`historico/aluno/${studentId}`);

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

          <CreateSurveyDialog
            studentId={applyStudentId}
            open={applyStudentId !== null}
            onOpenChange={(open) => { if (!open) setApplyStudentId(null); }}
          />
        </>
      )}
    </div>
  );
}