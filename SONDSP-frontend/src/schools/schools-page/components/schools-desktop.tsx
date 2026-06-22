import { useState } from "react";

import { useDeleteSchool, useSchools } from "../use-schools";
import { useTableState } from "@/hooks/useTableState";
import { buildPaginationProps } from "@/api/types";

import type { School } from "@/schools/schools.types";
import { SchoolUpsertPanel } from "./school-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { LinkUsersDialog } from "./link-users-dialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<School>[] = [
  { id: "name", header: "Nome", width: "300px" },
  { id: "principalName", header: "Diretor", width: "300px" },
  { id: "status", header: "Status", width: "300px"}
];

export function SchoolsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: schoolsPage, isLoading, isFetching } = useSchools({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useDeleteSchool();

  const [editSchoolId, setEditSchoolId] = useState<number | null>(null);
  const [deleteSchool, setDeleteSchool] = useState<School | null>(null);
  const [linkUsersSchool, setLinkUsersSchool] = useState<School | null>(null);

  const actions: RowAction<School>[] = [
    { type: "edit", onClick: (school) => setEditSchoolId(school.id), disabled: (user) => !user.status },
    { type: "link", onClick: (school) => setLinkUsersSchool(school), disabled: (school) => !school.status },
    { type: "delete", onClick: (school) => setDeleteSchool(school), disabled: (school) => !school.status }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando escolas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <SchoolUpsertPanel
        schoolIdToEdit={editSchoolId}
        onCancelEdit={() => setEditSchoolId(null)} 
      />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<School>
        data={schoolsPage?.content ?? []}
        columns={columns}
        rowKey={(school) => school.id}
        actions={actions}
        emptyMessage="Nenhuma escola encontrada"
        isFetching={isFetching}
        pagination={schoolsPage ? buildPaginationProps(schoolsPage, setPage) : undefined}
      />

      <LinkUsersDialog
        open={linkUsersSchool !== null}
        onOpenChange={(open) => { if (!open) setLinkUsersSchool(null); }}
      />

      <DeleteDialog<School>
        data={deleteSchool}
        title="Excluir Escola"
        open={deleteSchool !== null}
        onOpenChange={(open) => { if (!open) setDeleteSchool(null); }}
        isPending={isPending}
        onConfirm={(school) => 
          mutate(school.id, {
            onSuccess: () => setDeleteSchool(null)
          })
        }
      />
    </div>
  );
}