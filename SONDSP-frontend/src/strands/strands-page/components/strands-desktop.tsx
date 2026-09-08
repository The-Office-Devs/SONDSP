import { useState } from "react";

import type { Strand } from "@/strands/strands.types";
import { useStrands, useChangeStrandStatus } from "../use-strands";
import { useTableState } from "@/hooks/use-table-state";
import { buildPaginationProps } from "@/api/types";

import { StrandInsertPanel } from "./strand-insert-panel";
import { FilterBar } from "@/components/FilterBar/FilterBar";
import { DataTable, type ColumnDef, type RowAction } from "@/components/DataTable/DataTable";
import { InactivateDialog } from "@/components/Dialog/InactivateDialog";

const columns: ColumnDef<Strand>[] = [
  { id: "name", header: "Nome", width: "40%" },
  { id: "subject", header: "Matéria", width: "36%" },
  { id: "status", header: "Status", width: "10%" }
];

export function StrandsDesktop() {
  const { filter, setFilter, debouncedFilter, page, setPage, size } = useTableState(5);

  const { data: strandsPage, isLoading, isFetching } = useStrands({
    page,
    size,
    ...(debouncedFilter.trim() ? { search: debouncedFilter.trim() } : {})
  });

  const { mutate, isPending } = useChangeStrandStatus();

  const [inactivateStrand, setInactivateStrand] = useState<Strand | null>(null);

  const actions: RowAction<Strand>[] = [
    { type: "inactivate", onClick: (strand) => setInactivateStrand(strand), isActive: (strand) => strand.status }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-sm text-slate-500">Carregando eixos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:p-6">
      <StrandInsertPanel />

      <FilterBar value={filter} onChange={setFilter} />

      <DataTable<Strand>
        data={strandsPage?.content ?? []}
        columns={columns}
        rowKey={(strand) => strand.id}
        actions={actions}
        emptyMessage="Nenhum eixo encontrado"
        isFetching={isFetching}
        pagination={strandsPage ? buildPaginationProps(strandsPage, setPage) : undefined}
      />

      <InactivateDialog<Strand>
        data={inactivateStrand}
        title={inactivateStrand?.status ? "Inativar Eixo" : "Ativar Eixo"}
        open={inactivateStrand !== null}
        onOpenChange={(open) => { if (!open) setInactivateStrand(null) }}
        isPending={isPending}
        onConfirm={(strand) => 
          mutate(strand.id, {
            onSuccess: () => setInactivateStrand(null)
          })
        }
      />
    </div>
  );
}