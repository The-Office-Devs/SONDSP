import { useState } from "react";

import { useTableState } from "@/hooks/use-table-state";
import { useInactivateStudent, useStudents } from "../use-students";
import { buildPaginationProps } from "@/api/types";

import type { StudentListItem } from "@/students/students.types";
import { StudentUpsertPanel } from "./student-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "10%" },
  { id: "registration", header: "Matrícula", width: "14%", },
  { id: "name", header: "Nome", width: "20%" },
  { id: "schoolName", header: "Escola", width: "22%", accessor: (row) => row.schoolClass ? row.schoolClass.school.name : "-" },
  { id: "schoolClass", header: "Turma", width: "12%", accessor: (row) => row.schoolClass ? row.schoolClass.name : "-" },
  { id: "status", header: "Status", width: "8%" },
];

export function StudentsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: studentsPage, isFetching } = useStudents({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useInactivateStudent();

  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [inactivateStudent, setInactivateStudent] = useState<StudentListItem | null>(null);

  const actions: RowAction<StudentListItem>[] = [
    { type: "edit", onClick: (studentItem) => setEditStudentId(studentItem.id), disabled: (studentItem) => !studentItem.status },
    { type: "inactivate", onClick: (studentItem) => setInactivateStudent(studentItem), isActive: (studentItem) => studentItem.status }
  ];
  
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

      <InactivateDialog<StudentListItem>
        data={inactivateStudent}
        title={inactivateStudent?.status ? "Inativar Aluno" : "Ativar Aluno"}
        open={inactivateStudent !== null}
        onOpenChange={(open) => { if (!open) setInactivateStudent(null); }}
        isPending={isPending}
        onConfirm={(studentItem) => 
          mutate(studentItem.id, {
            onSuccess: () => {
              setInactivateStudent(null);

              if (studentItem.id === editStudentId) {
                setEditStudentId(null);
              }
            } 
          })
        }
      />
    </div>
  );
}