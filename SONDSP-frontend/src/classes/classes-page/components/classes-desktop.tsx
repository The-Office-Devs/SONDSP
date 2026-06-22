import { useState } from "react";

import { useClasses, useDeleteClass } from "../use-classes";
import { useTableState } from "@/hooks/useTableState";
import { buildPaginationProps } from "@/api/types";

import type { ClassListItem } from "@/classes/classes.types";
import { ClassUpsertPanel } from "./class-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { LinkUsersDialog } from "@/schools/schools-page/components/link-users-dialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<ClassListItem>[] = [
  { id: "school", header: "Escola", width: "180px", accessor: (row) => row.school.name },
  { id: "name", header: "Nome", width: "180px" },
  { id: "schoolYear", header: "Ano Letivo", width: "260px" },
  { id: "status", header: "Status", width: "180px" },
];

export function ClassesDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: classesPage, isLoading, isFetching } = useClasses({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useDeleteClass();

  const [editClassId, setEditClassId] = useState<number | null>(null);
  const [deleteClass, setDeleteClass] = useState<ClassListItem | null>(null);
  const [linkTeachersClass, setLinkTeachersClass] = useState<ClassListItem | null>(null);

  const actions: RowAction<ClassListItem>[] = [
    { type: "edit", onClick: (classItem) => setEditClassId(classItem.id), disabled: (classItem) => !classItem.status },
    { type: "link", onClick: (classItem) => setLinkTeachersClass(classItem), disabled: (classItem) => !classItem.status },
    { type: "delete", onClick: (classItem) => setDeleteClass(classItem), disabled: (classItem) => !classItem.status }
  ];
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando turmas...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassUpsertPanel
        classIdToEdit={editClassId}
        onCancelEdit={() => setEditClassId(null)} 
      />

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

      <LinkUsersDialog
        open={linkTeachersClass !== null}
        onOpenChange={(open) => { if (!open) setLinkTeachersClass(null); }}
        isTeachers={true}
      />

      <DeleteDialog<ClassListItem>
        data={deleteClass}
        title="Excluir Turma"
        open={deleteClass !== null}
        onOpenChange={(open) => { if (!open) setDeleteClass(null); }}
        isPending={isPending}
        onConfirm={(classItem) => 
          mutate(classItem.id, {
            onSuccess: () => setDeleteClass(null)
          })
        }
      />
    </div>
  )
}