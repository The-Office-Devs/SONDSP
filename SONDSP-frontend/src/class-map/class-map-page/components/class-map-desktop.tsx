import { useState } from "react";
import type { ClassMapFormData } from "../class-map.schema";
import { ClassMapFilterPanel } from "./class-map-filter-panel";
import { useClassMap } from "@/classes/classes-page/use-classes";

export function ClassMapDesktop() {
  const [appliedFilters, setAppliedFilters] = useState<ClassMapFormData | null>(null);

  const { data: classMap, isLoading, isFetching } = useClassMap(appliedFilters?.schoolClassId, {
    schoolId: appliedFilters?.schoolId,
    strandId: appliedFilters?.strandId,
    period: appliedFilters?.period || undefined,
  });

  const handleClear = () => setAppliedFilters(null);

  const hasRequiredFilters = !!appliedFilters?.schoolClassId && !!appliedFilters?.strandId;
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <ClassMapFilterPanel
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isLoading}
      />

      {!hasRequiredFilters ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma e um eixo no filtro acima para carregar os dados do mapa de classe
          </p>
        </div>
      ) : (
        <p>aaa</p>
      )}
    </div>
  );
}