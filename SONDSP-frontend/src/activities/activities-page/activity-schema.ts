import { z } from "zod/v4";

const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
];

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
  schoolYear: z
    .string()
    .length(4, "O ano letivo deve ter exatamente 4 caracteres"),
  bimester: z
    .string()
    .min(1, "Selecione um bimestre"),
  activityModelFile: z
    .instanceof(File, { message: "Selecione o modelo de atividade" })
    .refine(
      (f) => ACCEPTED_FILE_TYPES.includes(f.type),
      "Apenas imagens ou PDF são permitidos"
    )
});

export type ActivityFormInput = z.input<typeof activitySchema>;
export type ActivityFormData = z.output<typeof activitySchema>;