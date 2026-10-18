import { useSessionState } from "@/hooks/use-session-state";

import type { LearningTrajectoriesFormData } from "../learning-trajectories.schema";

import { LearningTrajectoriesCard } from "./learning-trajectories-card";
import { LearningTractoriesFilterPanel } from "./learning-trajectories-filter-panel";
import { useLearningTrajectory, useClass } from "@/classes/use-classes";
import { useStrand } from "@/strands/use-strands";

const LEARNING_TRAJECTORIES_FILTER_KEY = "learning-trajectories-filter";

export function LearningTrajectoriesDesktop() {
  const [appliedFilters, setAppliedFilters] = useSessionState<LearningTrajectoriesFormData | null>(
    LEARNING_TRAJECTORIES_FILTER_KEY,
    null
  );

  const { data: trajectories = [], isFetching } = useLearningTrajectory(appliedFilters?.schoolClassId, {
    strandId: appliedFilters?.strandId,
  });

  const { data: currentStrand } = useStrand(appliedFilters?.strandId ?? null);
  const { data: schoolClass } = useClass(appliedFilters?.schoolClassId ?? null);

  const handleClear = () => setAppliedFilters(null);

  const hasRequiredFilter = !!appliedFilters?.schoolClassId && !!appliedFilters?.strandId;
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <LearningTractoriesFilterPanel
        initialValues={appliedFilters}
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isFetching}
      />

      {!hasRequiredFilter ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma e um eixo no filtro acima para carregar os dados das trajetórias de aprendizagem
          </p>
        </div>
        ) : (
          <LearningTrajectoriesCard 
            trajectories={trajectories} 
            strandCode={currentStrand?.code}
            gradeLevel={schoolClass?.gradeLevel}
            isFetching={isFetching}
          />
        )}
    </div>
  );
}
