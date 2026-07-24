import { useState } from "react";

import { useDeleteSchool, useSchools } from "../use-schools";
import { useLinkUserToSchool } from "@/users/users-page/use-users";
import { useTableState } from "@/hooks/use-table-state";
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
  const { mutate: linkUserToSchool } = useLinkUserToSchool();

  const [editSchoolId, setEditSchoolId] = useState<number | null>(null);
  const [deleteSchool, setDeleteSchool] = useState<School | null>(null);
  const [linkUsersSchool, setLinkUsersSchool] = useState<School | null>(null);

  const handleLinkUserToSchool = (userId: number, userFunction: string) => {
    if (!linkUsersSchool) return;
    linkUserToSchool({ id: userId, data: { schoolId: linkUsersSchool.id, function: userFunction } });
  }

  const actions: RowAction<School>[] = [
    { type: "edit", onClick: (school) => setEditSchoolId(school.id), disabled: (user) => !user.status },
    { type: "link", onClick: (school) => setLinkUsersSchool(school), disabled: (school) => !school.status },
    { type: "delete", onClick: (school) => setDeleteSchool(school), isActive: (school) => school.status }
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
        onLink={handleLinkUserToSchool}
        queryParams={linkUsersSchool ? { schoolId: linkUsersSchool.id } : undefined}
      />

      <DeleteDialog<School>
        data={deleteSchool}
        title={deleteSchool?.status ? "Inativar Escola" : "Ativar Escola"}
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