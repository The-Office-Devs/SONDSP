import { z } from "zod/v4";
import { ALL_VALUE } from '@/lib/options-utils';

const requiredId = (message: string) => z.coerce.number().int().positive(message);

export const classMapSchema = z.object({
  schoolId: requiredId("Selecione uma escola"),
  schoolClassId: requiredId("Selecione uma turma"),
  subjectId: requiredId("Selecione uma matéria"),
  strandId: requiredId("Selecione um eixo"),
  period: z
    .string()
    .optional()
    .transform((v) => (!v || v === ALL_VALUE ? undefined : v))
});

export type ClassMapFormInput = z.input<typeof classMapSchema>;
export type ClassMapFormData = z.infer<typeof classMapSchema>;