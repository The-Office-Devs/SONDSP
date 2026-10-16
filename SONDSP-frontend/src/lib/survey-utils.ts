import type { LearningTrajectoryResults, TrajectoryLevel } from "@/learning-trajectories/learning-trajectories.types";
import { resultOptions } from "./options-utils";

export const LEGEND: SurveyResultCode[] = ["PS", "SV", "CV", "SA", "ALF"];
export type SurveyResultCode = "PS" | "SV" | "CV" | "SA" | "ALF";

export const NO_RESULT_DOT_CLASS = "bg-slate-300";

export const RESULT_DOT_CLASS: Record<SurveyResultCode, string> = {
  PS: "bg-red-600",
  SV: "bg-yellow-400",
  CV: "bg-orange-500",
  SA: "bg-blue-600",
  ALF: "bg-green-600"
};

export function getResultLabel(code: SurveyResultCode | null) {
  if (!code) return "Sem sondagem";
  return resultOptions.find((option) => option.value === code)?.label ?? code;
}

export function isKnownLevel(level: TrajectoryLevel): level is SurveyResultCode {
  return !!level && level in RESULT_DOT_CLASS;
}

export function getCurrentLevel(results: LearningTrajectoryResults): TrajectoryLevel {
  const periods = [results.initial, results.fstPeriod, results.sndPeriod, results.trdPeriod, results.frtPeriod];
  return [...periods].reverse().find(isKnownLevel) ?? null;
}