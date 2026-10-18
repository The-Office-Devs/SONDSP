import { useSessionState } from "@/hooks/use-session-state";

import { useClassMap } from "@/classes/use-classes";
import type { ClassMapAppliedFilters } from "../class-map.schema";

import { ClassMapFilterPanel } from "./class-map-filter-panel";
import { DomainPercentageCard } from "./domain-percentage-card";
import { DistributionCard } from "./distribution-card";
import { EvolutionComparativeCard } from "./evolution-comparative-card";

const CLASS_MAP_FILTER_KEY = "class-map-filter";

export function ClassMapDesktop() {
  const [appliedFilters, setAppliedFilters] = useSessionState<ClassMapAppliedFilters | null>(
    CLASS_MAP_FILTER_KEY,
    null
  );

  const { data: classMap, isFetching } = useClassMap(appliedFilters?.schoolClassId, {
    strandId: appliedFilters?.strandId,
    period: appliedFilters?.period || undefined,
  });

  const handleClear = () => setAppliedFilters(null);

  const hasRequiredFilters = !!appliedFilters?.schoolClassId && !!appliedFilters?.strandId;
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassMapFilterPanel
        initialValues={appliedFilters}
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isFetching}
      />

      {!hasRequiredFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma e um eixo no filtro acima para carregar os dados do mapa de classe
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
          <div className="space-y-4">
            <DomainPercentageCard
              items={classMap?.domainPercentage ?? []}
              isFetching={isFetching}
            />
            
            <DistributionCard
              items={classMap?.distribution ?? []}
              strandName={appliedFilters.strandName}
              isFetching={isFetching}
            />
          </div>

          <EvolutionComparativeCard
            items={classMap?.evolutionComparative ?? []}
            strandName={appliedFilters.strandName}
            isFetching={isFetching}
          />
        </div>
      )}
    </div>
  );
}