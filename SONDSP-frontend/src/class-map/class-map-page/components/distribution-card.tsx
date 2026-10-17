import { cn } from "@/lib/utils";

import { 
  barWidth, 
  formatRoundedPercent, 
  formatStudents, 
  getLevelClass, 
  getLevelLabel 
} from "@/lib/class-map-utils";

import type { DistributionItem } from "@/class-map/class-map.types";
import { ContentCard } from "@/components/Card/ContentCard";

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

  const headerRight = totalEvaluated > 0
    ? `${formatStudents(totalEvaluated)} ${totalEvaluated === 1 ? "avaliado" : "avaliados"}`
    : undefined;

  return (
    <ContentCard
      title={title}
      headerRight={headerRight}
      total={totalEvaluated}
      emptyMessage="Nenhum aluno avaliado com os filtros selecionados."
      isFetching={isFetching}
    >
      <ul className="space-y-3">
        {items.map((item) => {
          const levelClass = getLevelClass(item.level);

          return (
            <li key={item.level} className="rounded-md border border-neutral-300 bg-white px-3 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className={cn("size-3 rounded-full", levelClass)} />
                  <span className="text-sm font-semibold text-slate-800"> {item.level} </span>
                  <span className="self-start pt-0.5 text-[11px] text-slate-500">
                    {getLevelLabel(item.level)}
                  </span>
                </div>

                <span className="text-sm font-semibold tabular-nums text-slate-800">
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
    </ContentCard>
  );
}