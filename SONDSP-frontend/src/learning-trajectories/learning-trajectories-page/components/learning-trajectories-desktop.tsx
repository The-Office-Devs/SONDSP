import { useState } from "react"

import type { LearningTrajectoriesFormData } from "../learning-trajectories.schema";

import { LearningTractoriesFilterPanel } from "./learning-trajectories-filter-panel";
import type { LearningTrajectoryStudent } from "@/learning-trajectories/learning-trajectories.types";
import { LearningTrajectoriesCard } from "./learning-trajectories-card";

// TODO: MOCK ATE O BACK FICAR PRONTO
export const mockLearningTrajectories: LearningTrajectoryStudent[] = [
  { studentId: 1, studentName: "Ana Beatriz Silva", initial: "PS", firstBimester: "PS", secondBimester: "SV", thirdBimester: "CV", fourthBimester: "SA", currentLevel: "SA" },
  { studentId: 2, studentName: "Bruno Oliveira", initial: "PS", firstBimester: "SV", secondBimester: "SV", thirdBimester: "CV", fourthBimester: "SA", currentLevel: "ALF" },
  { studentId: 3, studentName: "Carla Mendes", initial: null, firstBimester: "PS", secondBimester: null, thirdBimester: "CV", fourthBimester: null, currentLevel: "CV" },
  { studentId: 4, studentName: "Daniel Santos", initial: "SV", firstBimester: "CV", secondBimester: "SA", thirdBimester: "ALF", fourthBimester: "ALF", currentLevel: "ALF" },
  { studentId: 5, studentName: "Júlio da Silva", initial: "PS", firstBimester: "SV", secondBimester: "CV", thirdBimester: "SA", fourthBimester: null, currentLevel: "SA" },
  { studentId: 6, studentName: "Larissa Ferreira", initial: "SV", firstBimester: "SV", secondBimester: "CV", thirdBimester: "CV", fourthBimester: null, currentLevel: "CV" },
  { studentId: 7, studentName: "Lucas Almeida", initial: null, firstBimester: null, secondBimester: null, thirdBimester: null, fourthBimester: null, currentLevel: null },
  { studentId: 8, studentName: "Mariana Costa", initial: "PS", firstBimester: "PS", secondBimester: "PS", thirdBimester: "SV", fourthBimester: null, currentLevel: "SV" },
  { studentId: 9, studentName: "Larissa Ferreira", initial: "SV", firstBimester: "SV", secondBimester: "CV", thirdBimester: "CV", fourthBimester: null, currentLevel: "CV" },
  { studentId: 10, studentName: "Lucas Almeida", initial: null, firstBimester: null, secondBimester: null, thirdBimester: null, fourthBimester: null, currentLevel: null },
  { studentId: 11, studentName: "Mariana Costa", initial: "PS", firstBimester: "PS", secondBimester: "PS", thirdBimester: "SV", fourthBimester: null, currentLevel: "SV" },
  { studentId: 12, studentName: "Larissa Ferreira", initial: "SV", firstBimester: "SV", secondBimester: "CV", thirdBimester: "CV", fourthBimester: null, currentLevel: "CV" },
  { studentId: 13, studentName: "Lucas Almeida", initial: null, firstBimester: null, secondBimester: null, thirdBimester: null, fourthBimester: null, currentLevel: null },
  { studentId: 14, studentName: "Mariana Costa", initial: "PS", firstBimester: "PS", secondBimester: "PS", thirdBimester: "SV", fourthBimester: null, currentLevel: "SV" }
];

export function LearningTrajectoriesDesktop() {
  const [appliedFilters, setAppliedFilters] = useState<LearningTrajectoriesFormData | null>(null);
  const isSearching = false; // TODO: alterar pelo do use...
  const isFetching = false;

  const handleClear = () => setAppliedFilters(null);

  const hasRequiredFilter = !!appliedFilters?.schoolClassId && !!appliedFilters?.strandId;
  return (
    <div className="space-y-4 p-4 lg:p-6">
      <LearningTractoriesFilterPanel
        onSearch={setAppliedFilters}
        onClear={handleClear}
        isSearching={isSearching}
      />

      {!hasRequiredFilter ? (
        <div className="flex flex-col items-center p-4 text-center">
          <p className="max-w-md text-sm text-slate-500">
            Por favor, selecione uma turma e um eixo no filtro acima para carregar os dados das trajetórias de aprendizagem
          </p>
        </div>
        ) : (
          <LearningTrajectoriesCard 
            students={mockLearningTrajectories} 
            isFetching={isFetching}
          />
        )}
    </div>
  );
}
