import { z } from "zod/v4";

export const classSchema = z.object({
  schoolId: z.coerce
    .number()
    .int()
    .positive("Selecione uma escola"),
  name: z
    .string()
    .trim()
    .min(1, "O nome da turma é obrigatório"),
  schoolYear: z
  .string()
  .length(4, "O ano letivo deve ter exatamente 4 caracteres")
});

export type ClassFormInput = z.input<typeof classSchema>;
export type ClassFormData = z.output<typeof classSchema>;