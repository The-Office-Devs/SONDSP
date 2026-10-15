import type { SurveyResultCode } from "@/lib/survey-utils";

export type TrajectoryLevel = SurveyResultCode | null;

// TODO: Alterar de acordo com o back
export interface LearningTrajectoryStudent {
  studentId: number;
  studentName: string;
  initial: TrajectoryLevel;
  firstBimester: TrajectoryLevel;
  secondBimester: TrajectoryLevel;
  thirdBimester: TrajectoryLevel;
  fourthBimester: TrajectoryLevel;
  currentLevel: TrajectoryLevel;
}