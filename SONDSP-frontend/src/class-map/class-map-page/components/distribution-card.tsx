import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { 
  barWidth, 
  formatRoundedPercent, 
  formatStudents, 
  getLevelClass, 
  getLevelLabel 
} from "@/lib/class-map-utils";

import type { DistributionItem } from "@/class-map/class-map.types";

interface DistributionCardProps {
  items: DistributionItem[];
  strandName?: string;
  isFetching?: boolean;
}

export function DistributionCard({
  items,
  strandName,
  isFetching = false
}: Readonly<DistributionCardProps>) {
  const title = strandName 
    ? `Distribuição por nível de ${strandName}` 
    : "Distribuição por nível";

  const totalEvaluated = items.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <section
      aria-label={title}
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

      <header className="flex items-center justify-between bg-primary px-4 py-3 text-white">
        <h2 className="text-sm font-semibold"> {title} </h2>
        {totalEvaluated > 0 && (
          <span className="text-sm font-medium">
            {formatStudents(totalEvaluated)} {totalEvaluated === 1 ? "avaliado" : "avaliados"}
          </span>
        )}
      </header>

      <div className="p-4">
        {totalEvaluated === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            Nenhum aluno avaliado com os filtros selecionados.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((item) => {
              const levelClass = getLevelClass(item.level);

              return (
                <li
                  key={item.level}
                  className="rounded-md border border-neutral-300 bg-white px-3 py-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={cn("size-3 rounded-full", levelClass)} />
                      <span className="text-sm font-semibold text-slate-800"> {item.level} </span>
                      <span className="self-start pt-0.5 text-[11px] text-slate-500">
                        {getLevelLabel(item.level)}
                      </span>
                    </div>

                    <span className="text-sm tabular-nums text-slate-800">
                      {item.quantity} ({formatRoundedPercent(item.percentual)})
                    </span>
                  </div>

                  <div aria-hidden="true" className="mt-2 h-3 rounded-full bg-primary/15">
                    <div
                      className={cn("h-full rounded-full", levelClass)}
                      style={{ width: barWidth(item.percentual) }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}