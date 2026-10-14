import { ArrowDown, ArrowUp, Minus, type LucideIcon } from "lucide-react";

import { RESULT_DOT_CLASS, type SurveyResultCode } from "./survey-utils";
import { resultOptions } from "./options-utils";

interface DeltaTrend {
  Icon: LucideIcon;
  color: string;
}

export const UNKNOWN_LEVEL_CLASS = "bg-slate-400";
export const AXIS_TEXT_COLOR = "#64748B";
export const BEFORE_COLOR = "#E58B2F";
export const AFTER_COLOR = "#60A5FA";
export const SLATE_200_COLOR = "#E2E8F0";
export const LEVEL_TEXT_COLOR = "#334155";
export const AFTER_FILL_ID = "class-map-after-fill";

export const DELTA_UP_COLOR = "#15803D";
export const DELTA_DOWN_COLOR = "#DC2626";

export function formatPercent(value: number) {
  return `${Math.floor(value)}%`;
}

export function formatRoundedPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function formatStudents(count: number) {
  return `${count} ${count === 1 ? "aluno" : "alunos"}`;
}

export function barWidth(percentage: number) {
  return `${Math.min(Math.max(percentage, 0), 100)}%`;
}

export function getLevelLabel(level: string) {
  return resultOptions.find((option) => option.value === level)?.label ?? "";
}

export function getLevelClass(level: string) {
  return RESULT_DOT_CLASS[level as SurveyResultCode] ?? UNKNOWN_LEVEL_CLASS;
}

export function getDeltaTrend(delta: number): DeltaTrend {
  if (delta > 0) return { Icon: ArrowUp, color: DELTA_UP_COLOR };
  if (delta < 0) return { Icon: ArrowDown, color: DELTA_DOWN_COLOR };
  return { Icon: Minus, color: AXIS_TEXT_COLOR };
}

export const SERIES = [
  { key: "before", label: "Antes", color: BEFORE_COLOR },
  { key: "after", label: "Depois", color: AFTER_COLOR }
] as const;