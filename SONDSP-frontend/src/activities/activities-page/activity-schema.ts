import { z } from "zod/v4";
import { ACCEPTED_FILE_TYPES } from "@/lib/file-utils";

export const activitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome do modelo de atividade é obrigatório"),
  subjectId: z.coerce
    .number()
    .int()
    .positive("Selecione uma matéria"),
  strandId: z.coerce
    .number()
    .int()
    .positive("Selecione um eixo"),
  gradeLevel: z
    .string()
    .min(1, "Selecione um ano escolar"),
  bimester: z
    .string()
    .min(1, "Selecione um bimestre"),
  activityModelFile: z
    .instanceof(File, { message: "Selecione um modelo de atividade" })
    .refine(
      (f) => ACCEPTED_FILE_TYPES.includes(f.type),
      "Apenas imagens ou PDF são permitidos"
    ),
});

export type ActivityFormInput = z.input<typeof activitySchema>;
export type ActivityFormData = z.output<typeof activitySchema>;