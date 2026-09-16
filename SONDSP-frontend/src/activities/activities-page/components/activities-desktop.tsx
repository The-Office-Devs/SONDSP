import { useState, useMemo } from "react";

import type { ActivityListItem } from "@/activities/activities.types";
import { useActivities,  useActivityImage, useInactivateActivity } from "../use-activities";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";
import { blobToFile } from "@/lib/file-utils";

import { ActivityInsertPanel } from "./activity-insert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";
import { ViewFileDialog } from "@/components/Dialog/ViewFileDialog";

const columns: ColumnDef<ActivityListItem>[] = [
  { id: "name", header: "Nome", width: "25%" },
  { id: "subject", header: "Matéria", width: "15%", accessor: (row) => row.strand?.subject },
  { id: "strand", header: "Eixo", width: "15%", accessor: (row) => row.strand?.name },
  { id: "bimester", header: "Bimestre", width: "21%", accessor: (row) => `${row.bimester} - ${row.schoolYear}` },
  { id: "status", header: "Status", width: "10%" },
];

export function ActivitiesDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: activitiesPage, isFetching } = useActivities({ 
    page, 
    size, 
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });
  const { mutate, isPending } = useInactivateActivity();

  const [viewActivity, setViewActivity] = useState<ActivityListItem | null>(null);
  const [inactivateActivity, setInactivateActivity] = useState<ActivityListItem | null>(null);
  
  const { data: imageBlob, isFetching: isFetchingImage } = useActivityImage(viewActivity?.id);

  const actions: RowAction<ActivityListItem>[] = [
    { type: "view", onClick: (activityItem) => setViewActivity(activityItem) },
    { type: "inactivate", onClick: (activityItem) => setInactivateActivity(activityItem), isActive: (activityItem) => activityItem.status }
  ];

  const viewFile = useMemo(() => {
    if (viewActivity && imageBlob) return blobToFile(imageBlob, viewActivity.name);
    return undefined;
  }, [viewActivity, imageBlob]);

  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ActivityInsertPanel />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<ActivityListItem>
        data={activitiesPage?.content || []}
        columns={columns}
        rowKey={(activityItem) => activityItem.id}
        actions={actions}
        emptyMessage="Nenhum modelo de atividade encontrado"
        isFetching={isFetching}
        pagination={activitiesPage ? buildPaginationProps(activitiesPage, setPage) : undefined}
      />

      <InactivateDialog<ActivityListItem>
        data={inactivateActivity}
        title={inactivateActivity?.status ? "Inativar Modelo de Atividade" : "Ativar Modelo de Atividade"}
        open={inactivateActivity !== null}
        onOpenChange={(open) => { if (!open) setInactivateActivity(null); }}
        isPending={isPending}
        onConfirm={(activityItem) => 
          mutate(activityItem.id, {
            onSuccess: () => setInactivateActivity(null)
          })
        }
      />

      <ViewFileDialog
        file={viewFile}
        title={isFetchingImage ? "Baixando arquivo..." : (viewActivity?.name ?? "")}
        open={viewActivity !== null}
        onOpenChange={(open) => { if (!open) setViewActivity(null) }}
      />
    </div>
  )
}