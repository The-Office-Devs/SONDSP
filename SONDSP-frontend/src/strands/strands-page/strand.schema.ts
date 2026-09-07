import { z } from "zod/v4";

export const strandSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "O nome do eixo é obrigatório"),
  subject: z
    .string()
    .min(1, "Selecione uma matéria")
});

export type StrandFormData = z.infer<typeof strandSchema>;