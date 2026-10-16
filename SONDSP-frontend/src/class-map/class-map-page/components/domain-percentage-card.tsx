import { Loader2 } from "lucide-react";

import { barWidth, formatPercent, formatStudents } from "@/lib/class-map-utils";
import type { DomainPercentageItem } from "@/class-map/class-map.types";

interface DomainPercentageCardProps {
  items: DomainPercentageItem[];
  isFetching?: boolean;
}

export function DomainPercentageCard({
  items,
  isFetching = false
}: Readonly<DomainPercentageCardProps>) {
  return (
    <section
      aria-label="Percentual de alunos que dominam cada sondagem vigente"
      aria-busy={isFetching}
      className="relative w-full overflow-hidden rounded-xl border border-neutral-300 bg-neutral-100"
    >
      {isFetching && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Carregando dados...</span>
          </div>
        </div>
      )}

      <header className="bg-primary px-4 py-3 text-white">
        <h2 className="text-sm font-semibold"> Percentual de alunos que dominam cada sondagem vigente </h2>
      </header>

      <div className="p-4">
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhuma sondagem ativa neste eixo.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.name}
                className="rounded-md border border-neutral-300 bg-white px-3 py-3"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-sm font-medium text-slate-800" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatPercent(item.percentual)}
                  </span>
                </div>

                <div aria-hidden="true" className="mt-2 h-3 rounded-full bg-primary/15">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: barWidth(item.percentual) }}
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  {item.total > 0
                    ? `${item.expectedQuantity} de ${formatStudents(item.total)} (${formatPercent(item.percentual)})`
                    : "Nenhum aluno avaliado"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}