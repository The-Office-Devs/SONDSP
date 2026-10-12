import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useClasses } from "@/classes/use-classes";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";

import type { ClassListItem } from "@/classes/classes.types";
import type { ClassFilterFormData } from "../class-filter.schema";

import { ClassesFilterPanel } from "./class-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";

const columns: ColumnDef<ClassListItem>[] = [
  { id: "name", header: "Turma", width: "15%" },
  { id: "gradeLevel", header: "Ano Escolar", width: "10%" },
  { id: "shift", header: "Turno", width: "10%" },
  { id: "numStudents", header: "Quantidade de Alunos", width: "10%" }
];

export function ClassesFilterDesktop() {
  const navigator = useNavigate();
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);
  const [appliedFilters, setAppliedFilters] = useState<ClassFilterFormData | null>(null);

  const { data: classesPage, isFetching, isLoading } = useClasses(
    {
      page,
      size,
      status: true,
      hasStudents: true,
      schoolId: appliedFilters?.schoolId,
      shift: appliedFilters?.shift,
      gradeLevel: appliedFilters?.gradeLevel,
      schoolYear: appliedFilters?.schoolYear,
      ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
    },
    { enabled: !!appliedFilters }
  );

  const actions: RowAction<ClassListItem>[] = [
    { 
      type: "openClass", 
      label: "Abrir Turma", 
      className: "w-40",
      onClick: (classItem) => goToTurma(classItem.id), 
    },
    { 
      type: "download", 
      label: "Gerar Relatório",
      className: "w-44", 
      onClick: (classItem) => generateReport(classItem.id) 
    },
  ];

  const handleClear = () => {
    setAppliedFilters(null);
    setFilter("");
    setPage(0);
  };

  const goToTurma = (classId: number) => navigator(`turma/${classId}`);

  const generateReport = (classId: number) => {
    // TODO: Implementar a logica para gerar o relatorio da turma!!!
    // esperar o endpoint ficar pronto
    return;
  };

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassesFilterPanel
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isLoading}
      />

      {!appliedFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma escola no filtro acima para carregar a lista de turmas
          </p>
        </div>
      ) : (
        <>
          <FilterBar value={filter} onChange={setFilter} />

          <DataTable<ClassListItem>
            data={classesPage?.content ?? []}
            columns={columns}
            rowKey={(classItem) => classItem.id}
            actions={actions}
            emptyMessage="Nenhuma turma encontrada"
            isFetching={isFetching}
            pagination={classesPage ? buildPaginationProps(classesPage, setPage) : undefined}
          />
        </>
      )}
    </div>
  );
}