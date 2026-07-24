import { useState } from "react";

import { useTableState } from "@/hooks/use-table-state";
import { useDeleteStudent, useStudents } from "../use-students";
import { buildPaginationProps } from "@/api/types";

import type { StudentListItem } from "@/students/students.types";
import { StudentUpsertPanel } from "./student-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "120px" },
  { id: "registration", header: "Matrícula", width: "180px", },
  { id: "name", header: "Nome", width: "180px" },
  { id: "schoolName", header: "Escola", width: "260px", accessor: (row) => row.schoolClass ? row.schoolClass.school.name : "-" },
  { id: "schoolClass", header: "Turma", width: "260px", accessor: (row) => row.schoolClass ? row.schoolClass.name : "-" },
  { id: "status", header: "Status", width: "180px" },
];

export function StudentsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: studentsPage, isLoading, isFetching } = useStudents({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useDeleteStudent();

  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<StudentListItem | null>(null);

  const actions: RowAction<StudentListItem>[] = [
    { type: "edit", onClick: (studentItem) => setEditStudentId(studentItem.id), disabled: (studentItem) => !studentItem.status },
    { type: "delete", onClick: (studentItem) => setDeleteStudent(studentItem), isActive: (studentItem) => studentItem.status }
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando alunos...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <StudentUpsertPanel
        studentIdToEdit={editStudentId}
        onCancelEdit={() => setEditStudentId(null)} 
      />

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

      <DeleteDialog<StudentListItem>
        data={deleteStudent}
        title={deleteStudent?.status ? "Inativar Aluno" : "Ativar Aluno"}
        open={deleteStudent !== null}
        onOpenChange={(open) => { if (!open) setDeleteStudent(null); }}
        isPending={isPending}
        onConfirm={(studentItem) => 
          mutate(studentItem.id, {
            onSuccess: () => setDeleteStudent(null)
          })
        }
      />
    </div>
  );
}