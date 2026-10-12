export type SurveyResultCode = "PS" | "SV" | "CV" | "SA" | "ALF";

export const RESULT_DOT_CLASS: Record<SurveyResultCode, string> = {
  PS: "bg-red-600",
  SV: "bg-yellow-400",
  CV: "bg-orange-500",
  SA: "bg-blue-600",
  ALF: "bg-green-600"
};