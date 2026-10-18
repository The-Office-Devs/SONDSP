import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { StudentListItem } from "@/students/students.types";
import { type SurveyFormData } from "../survey-schema";
import { useSessionState } from "@/hooks/use-session-state";
import { useStudents } from "@/students/students-page/use-students";
import { buildPaginationProps } from "@/api/types";
import { useTableState } from "@/hooks/use-table-state";

import { SurveysFilterPanel } from "./surveys-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { CreateSurveyDialog } from "@/components/Dialog/CreateSurveyDialog";

const SURVEYS_FILTER_KEY = "surveys-filter";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "10%" },
  { id: "registration", header: "Matrícula", width: "10%", },
  { id: "name", header: "Nome", width: "40%" }
];

export function SurveysDesktop() {
  const navigator = useNavigate();
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5, SURVEYS_FILTER_KEY);
  const [appliedFilters, setAppliedFilters] = useSessionState<SurveyFormData | null>(
    `${SURVEYS_FILTER_KEY}:applied`,
    null
  );
  const [applyStudentId, setApplyStudentId] = useState<number | null>(null);

  const { data: studentsPage, isFetching } = useStudents(
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

  const handleSearch = (data: SurveyFormData) => {
    setAppliedFilters(data);
    setPage(0);
  };

  const handleClear = () => {
    setAppliedFilters(null);
    setFilter("");
    setPage(0);
  };
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SurveysFilterPanel 
        initialValues={appliedFilters}
        onSearch={handleSearch}
        onClear={handleClear} 
        isSearching={isFetching} 
      />
      
      {!appliedFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma no filtro acima para carregar a lista de alunos e criar as sondagens
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