import { z } from "zod/v4";

export const surveyHistorySchema = z.object({
  status: z
    .enum(["all", "true", "false"])
    .transform((v) => (v === "all" ? undefined : v === "true")),
  bimester: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  subjectId: z.coerce
    .number()
    .int()
    .optional()
    .transform((v) => (v && v > 0 ? v : undefined)),
  strandId: z.coerce
    .number()
    .int()
    .optional()
    .transform((v) => (v && v > 0 ? v : undefined)),
}).refine(
  (data) => !data.subjectId || !!data.strandId,
  {
    message: "Selecione o eixo",
    path: ["strandId"],
  }
);

export type SurveyHistoryFormInput = z.input<typeof surveyHistorySchema>
export type SurveyHistoryFormData = z.infer<typeof surveyHistorySchema>