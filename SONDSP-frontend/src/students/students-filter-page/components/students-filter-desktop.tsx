import { useSessionState } from "@/hooks/use-session-state";
import { useNavigate } from "react-router-dom";

import type { StudentListItem } from "@/students/students.types";
import type { StudentFilterFormData } from "../student-filter.schema";
import { useStudents } from "@/students/students-page/use-students";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";

import { StudentsFilterPanel } from "./students-filter-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";

const STUDENTS_FILTER_KEY = "students-filter";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "10%" },
  { id: "registration", header: "Matrícula", width: "10%", },
  { id: "name", header: "Nome", width: "40%" }
];

export function StudentsFilterDesktop() {
  const navigator = useNavigate();
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5, STUDENTS_FILTER_KEY);
  const [appliedFilters, setAppliedFilters] = useSessionState<StudentFilterFormData | null>(
    `${STUDENTS_FILTER_KEY}:applied`,
    null
  );

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
    { 
      type: "viewPortfolio", 
      label: "Ver Portfolio", 
      className: "w-36",
      onClick: (studentItem) => goToPortfolio(studentItem.id) 
    },
  ];

  const goToPortfolio = (studentId: number) => navigator(`portfolio/aluno/${studentId}`);

  const handleSearch = (data: StudentFilterFormData) => {
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
      <StudentsFilterPanel
        initialValues={appliedFilters}
        onSearch={handleSearch}
        onClear={handleClear} 
        isSearching={isFetching} 
      />
      
      {!appliedFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma no filtro acima para carregar a lista de alunos e ver seus portólios
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