import { useState } from "react";

import type { StrandListItem } from "@/strands/strands.types";
import { useTableState } from "@/hooks/use-table-state";

import { StrandInsertPanel } from "./strand-insert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const mockData: StrandListItem[] = [
  { id: 1, name: "Números", subject: "Matemática", status: true },
  { id: 2, name: "Cotidiano", subject: "Matemática", status: false }
]

const columns: ColumnDef<StrandListItem>[] = [
  { id: "name", header: "Nome", width: "180px" },
  { id: "subject", header: "Matéria", width: "180px" },
  { id: "status", header: "Status", width: "120px" }
];

export function StrandsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const [inactivateStrand, setInactivateStrand] = useState<StrandListItem | null>(null);

  const actions: RowAction<StrandListItem>[] = [
    { type: "inactivate", onClick: (strand) => setInactivateStrand(strand), isActive: (strand) => strand.status }
  ]

  /*if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando eixos...</p>
      </div>
    );
  }*/

  return (
    <div className="space-y-4 lg:p-6">
      <StrandInsertPanel />

      <FilterBar value={filter}  onChange={setFilter} />

      <DataTable<StrandListItem>
        data={mockData}
        columns={columns}
        rowKey={(strand) => strand.id}
        actions={actions}
        emptyMessage="Nenhum eixo encontrado"
        /*isFetching={isFetching}
        pagination={strandsPage ? buildPaginationProps(strandsPage, setPage) : undefined}*/
      />

      <InactivateDialog<StrandListItem>
        data={inactivateStrand}
        title={inactivateStrand?.status ? "Inativar Eixo" : "Ativar Eixo"}
        open={inactivateStrand !== null}
        onOpenChange={(open) => { if (!open) setInactivateStrand(null) }}
        isPending={false}
        onConfirm={() => null}
        /*isPending={isPending}
        onConfirm={(strand) => 
          mutate(strand.id, {
            onSuccess: () => setStatusStrand(null)
          })
        }*/
      />
    </div>
  );
}