import { barWidth, formatPercent, formatStudents } from "@/lib/class-map-utils";
import type { DomainPercentageItem } from "@/class-map/class-map.types";

import { ContentCard } from "@/components/Card/ContentCard";

interface DomainPercentageCardProps {
  items: DomainPercentageItem[];
  isFetching?: boolean;
}

export function DomainPercentageCard({
  items,
  isFetching = false
}: Readonly<DomainPercentageCardProps>) {
  return (
    <ContentCard
      title="Percentual de alunos que dominam cada sondagem vigente"
      total={items.length}
      emptyMessage="Nenhuma sondagem ativa neste eixo."
      isFetching={isFetching}
    >
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.name} className="rounded-md border border-neutral-300 bg-white px-3 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="min-w-0 truncate text-sm font-medium text-slate-800" title={item.name}>
                {item.name}
              </span>
              <span className="shrink-0 text-sm font-semibold text-slate-900">
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
    </ContentCard>
  );
}