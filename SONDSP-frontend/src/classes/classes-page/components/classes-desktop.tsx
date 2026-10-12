import { useState } from "react";

import { useClasses, useInactivateClass } from "../../use-classes";
import { useLinkUserToSchoolClass } from "@/users/users-page/use-users";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";

import type { ClassListItem } from "@/classes/classes.types";
import { ClassUpsertPanel } from "./class-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { LinkUsersDialog } from "@/schools/schools-page/components/link-users-dialog";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const columns: ColumnDef<ClassListItem>[] = [
  { id: "school", header: "Escola", width: "30%", accessor: (row) => row.school.name },
  { id: "name", header: "Nome", width: "10%" },
  { id: "shift", header: "Turno", width: "10%" },
  { id: "gradeLevel", header: "Ano Escolar", width: "10%" },
  { id: "schoolYear", header: "Ano Letivo", width: "12%" },
  { id: "status", header: "Status", width: "10%" },
];

export function ClassesDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: classesPage, isFetching } = useClasses({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useInactivateClass();
  const { mutate: linkUserToSchoolClass } = useLinkUserToSchoolClass();

  const [editClassId, setEditClassId] = useState<number | null>(null);
  const [inactivateClass, setInactivateClass] = useState<ClassListItem | null>(null);
  const [linkTeachersClass, setLinkTeachersClass] = useState<ClassListItem | null>(null);

  const handleLinkUserToSchoolClass = (userId: number, userFunction: string) => {
    if (!linkTeachersClass) return;
    linkUserToSchoolClass({ id: userId, data: { schoolClassId: linkTeachersClass.id, function: userFunction } });
  }

  const actions: RowAction<ClassListItem>[] = [
    { type: "edit", onClick: (classItem) => setEditClassId(classItem.id), disabled: (classItem) => !classItem.status },
    { type: "link", onClick: (classItem) => setLinkTeachersClass(classItem), disabled: (classItem) => !classItem.status },
    { type: "inactivate", onClick: (classItem) => setInactivateClass(classItem), isActive: (classItem) => classItem.status }
  ];
  
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
        onLink={handleLinkUserToSchoolClass}
        queryParams={
          linkTeachersClass
            ? { linkedToSchoolId: linkTeachersClass.school.id, schoolClassId: linkTeachersClass.id }
            : undefined
        }
        isTeachers={true}
      />

      <InactivateDialog<ClassListItem>
        data={inactivateClass}
        title={inactivateClass?.status ? "Inativar Turma" : "Ativar Turma"}
        open={inactivateClass !== null}
        onOpenChange={(open) => { if (!open) setInactivateClass(null); }}
        isPending={isPending}
        onConfirm={(classItem) => 
          mutate(classItem.id, {
            onSuccess: () => {
              setInactivateClass(null);

              if (classItem.id === editClassId) {
                setEditClassId(null);
              }
            }
          })
        }
      />
    </div>
  )
}