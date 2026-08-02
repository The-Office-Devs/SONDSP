import { useState } from "react";

import { useTableState } from "@/hooks/useTableState";

import type { ActivityListItem } from "@/activities/activities.types";
import { ActivityInsertPanel } from "./activity-insert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";
import { ViewFileDialog } from "@/components/Dialog/ViewFileDialog";

const mockData: ActivityListItem[] = [
  { 
    id: 1, 
    name: "Atividade 1",
    subject: "Matemática",
    strand: "Números",
    bimester: "1° Bimestre",
    schoolYear: "2026",
    activityModelRef: "imagem", // back ja vai enviar o arquivo aqui ou precisa de uma requisição especifica
    status: true 
  },
  { 
    id: 2, 
    name: "Atividade 2", 
    subject: "Matemática", 
    strand: "Mais Números",
    bimester: "2° Bimestre",
    schoolYear: "2026",
    activityModelRef: "imagem 2",
    status: false 
  }
];

const columns: ColumnDef<ActivityListItem>[] = [
  { id: "name", header: "Nome", width: "180px" },
  { id: "subject", header: "Matéria", width: "120px" },
  { id: "strand", header: "Eixo", width: "180px", },
  { id: "bimester", header: "Bimestre", width: "180px", accessor: (row) => `${row.bimester} - ${row.schoolYear}` },
  { id: "status", header: "Status", width: "180px" },
];

export function ActivitiesDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const [openViewFile, setOpenViewFile] = useState(false);
  const [inactivateActivity, setInactivateActivity] = useState<ActivityListItem | null>(null);

  const actions: RowAction<ActivityListItem>[] = [
    { type: "view", onClick: () => setOpenViewFile(true) },
    { type: "inactivate", onClick: (activityItem) => setInactivateActivity(activityItem), isActive: (activityItem) => activityItem.status }
  ];

  /*if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando modelos de atividades...</p>
      </div>
    );
  }*/

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ActivityInsertPanel />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<ActivityListItem>
        data={mockData}
        columns={columns}
        rowKey={(activityItem) => activityItem.id}
        actions={actions}
        emptyMessage="Nenhum modelo de atividade encontrado"
        /*isFetching={isFetching}
        pagination={studentsPage ? buildPaginationProps(studentsPage, setPage) : undefined}*/
      />

      <InactivateDialog<ActivityListItem>
        data={inactivateActivity}
        title={inactivateActivity?.status ? "Inativar Modelo de Atividade" : "Ativar Modelo de Atividade"}
        open={inactivateActivity !== null}
        onOpenChange={(open) => { if (!open) setInactivateActivity(null); }}
        isPending={false}
        onConfirm={() => null}
        /*isPending={isPending}
        onConfirm={(ativityItem) => 
          mutate(ativityItem.id, {
            onSuccess: () => setInactivateActivity(null)
          })
        }*/
      />

      <ViewFileDialog
        file="aaaa"
        title="Modelo de Atividade"
        open={openViewFile != false}
        onOpenChange={(open) => { if (!open) setOpenViewFile(false)}}
      />
    </div>
  )
}