import { useState } from "react";

import { useInactivateSchool, useSchools } from "../use-schools";
import { useLinkUserToSchool } from "@/users/users-page/use-users";
import { useTableState } from "@/hooks/useTableState";
import { buildPaginationProps } from "@/api/types";

import type { School } from "@/schools/schools.types";
import { SchoolUpsertPanel } from "./school-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { LinkUsersDialog } from "./link-users-dialog";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const columns: ColumnDef<School>[] = [
  { id: "codigoInep", header: "Código INEP", width: "20%" },
  { id: "name", header: "Nome", width: "34%" },
  { id: "principalName", header: "Diretor", width: "30%" },
  { id: "status", header: "Status", width: "16%"}
];

export function SchoolsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: schoolsPage, isLoading, isFetching } = useSchools({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useInactivateSchool();
  const { mutate: linkUserToSchool } = useLinkUserToSchool();

  const [editSchoolId, setEditSchoolId] = useState<number | null>(null);
  const [inactivateSchool, setInactivateSchool] = useState<School | null>(null);
  const [linkUsersSchool, setLinkUsersSchool] = useState<School | null>(null);

  const handleLinkUserToSchool = (userId: number, userFunction: string) => {
    if (!linkUsersSchool) return;
    linkUserToSchool({ id: userId, data: { schoolId: linkUsersSchool.id, function: userFunction } });
  }

  const actions: RowAction<School>[] = [
    { type: "edit", onClick: (school) => setEditSchoolId(school.id), disabled: (user) => !user.status },
    { type: "link", onClick: (school) => setLinkUsersSchool(school), disabled: (school) => !school.status },
    { type: "inactivate", onClick: (school) => setInactivateSchool(school), isActive: (school) => school.status }
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

      <InactivateDialog<School>
        data={inactivateSchool}
        title={inactivateSchool?.status ? "Inativar Escola" : "Ativar Escola"}
        open={inactivateSchool !== null}
        onOpenChange={(open) => { if (!open) setInactivateSchool(null); }}
        isPending={isPending}
        onConfirm={(school) => 
          mutate(school.id, {
            onSuccess: () => {
              setInactivateSchool(null);

              if (school.id === editSchoolId) {
                setEditSchoolId(null);
              }
            }
          })
        }
      />
    </div>
  );
}