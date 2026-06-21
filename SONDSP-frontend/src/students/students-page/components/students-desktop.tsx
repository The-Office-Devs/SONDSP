import { useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useDeleteStudent, useStudents } from "../use-students";

import type { StudentListItem } from "@/students/students.types";
import { StudentUpsertPanel } from "./student-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<StudentListItem>[] = [
  { id: "rowNumber", header: "N° Chamada", width: "180px" },
  { id: "registration", header: "Matrícula", width: "180px", },
  { id: "name", header: "Nome", width: "180px" },
  { id: "schoolClass", header: "Turma", width: "260px", accessor: (row) => `${row.schoolClass.name} - ${row.schoolClass.school.name}` },
  { id: "status", header: "Status", width: "180px" },
];

export function StudentsDesktop() {
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter);

  const { data: students = [], isLoading } = useStudents(
    debouncedFilter.trim() ? { search: debouncedFilter.trim() } : undefined
  );
  const { mutate, isPending } = useDeleteStudent();

  const [editStudentId, setEditStudentId] = useState<number | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<StudentListItem | null>(null);

  const actions: RowAction<StudentListItem>[] = [
    { type: "edit", onClick: (studentItem) => setEditStudentId(studentItem.id), disabled: (studentItem) => !studentItem.status },
    { type: "delete", onClick: (studentItem) => setDeleteStudent(studentItem), disabled: (studentItem) => !studentItem.status }
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
        data={students}
        columns={columns}
        rowKey={(studentItem) => studentItem.id}
        actions={actions}
        emptyMessage="Nenhum aluno encontrado"
      />

      <DeleteDialog<StudentListItem>
        data={deleteStudent}
        title="Excluir Aluno"
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