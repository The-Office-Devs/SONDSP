import { useMemo, useState } from "react";

import type { SchoolRow } from "@/schools/schools.types";
import { useDeleteSchool, useSchools } from "../use-schools";

import { SchoolUpsertPanel } from "./school-upsert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { LinkUsersDialog } from "./link-users-dialog";
import { DeleteDialog } from "@/components/Dialog/DeleteDialog";

const columns: ColumnDef<SchoolRow>[] = [
  { id: "name", header: "Nome", width: "400px" },
  { id: "principalName", header: "Diretor", width: "400px" }
];

export function SchoolsDesktop() {
  const { data: schools = [], isLoading } = useSchools();
  const { mutate, isPending } = useDeleteSchool();

  const [filter, setFilter] = useState('');
  const [editSchoolId, setEditSchoolId] = useState<number | null>(null);
  const [deleteSchool, setDeleteSchool] = useState<SchoolRow | null>(null);
  const [linkUsersSchool, setLinkUsersSchool] = useState<SchoolRow | null>(null);

  const filteredSchools = useMemo(() => {
    //TODO: implementar paginação na tabela e filtro disparando requisição para o backend
    if (!filter.trim()) return schools;
    const lowerFilter = filter.toLowerCase();
    return schools.filter((s) => s.name.toLowerCase().includes(lowerFilter));
  }, [schools, filter]);

  const actions: RowAction<SchoolRow>[] = [
    { type: "edit", onClick: (school) => setEditSchoolId(school.id) },
    { type: "link", onClick: (school) => setLinkUsersSchool(school) },
    { type: "delete", onClick: (school) => setDeleteSchool(school) }
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

      <DataTable<SchoolRow>
        data={schools}
        columns={columns}
        rowKey={(school) => school.id}
        actions={actions}
        emptyMessage="Nenhuma escola encontrada"
      />

      <LinkUsersDialog
        school={linkUsersSchool}
        open={linkUsersSchool !== null}
        onOpenChange={(open) => { if (!open) setLinkUsersSchool(null); }}
      />

      <DeleteDialog<SchoolRow>
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