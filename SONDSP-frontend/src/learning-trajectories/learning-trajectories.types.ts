import type { SurveyResultCode } from "@/lib/survey-utils";

export type TrajectoryLevel = SurveyResultCode | null;

export interface LearningTrajectoryResults {
  initial: TrajectoryLevel;
  fstPeriod: TrajectoryLevel;
  sndPeriod: TrajectoryLevel;
  trdPeriod: TrajectoryLevel;
  frtPeriod: TrajectoryLevel;
}

export interface LearningTrajectoryFilter {
  strandId: number | undefined;
}

export interface LearningTrajectory {
  student: { id: number; nome: string; };
  results: LearningTrajectoryResults;
}