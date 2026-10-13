import { z } from "zod/v4";
import { ALL_VALUE } from "@/lib/options-utils";

const requiredId = (message: string) => z.coerce.number().int().positive(message);

export const classDetailsSchema = z.object({
  subjectId: requiredId("Selecione uma matéria"),
  strandId: requiredId("Selecione um eixo"),
  applicationPeriod: z
    .string()
    .optional()
    .transform((v) => (!v || v === ALL_VALUE ? undefined : v))
});

export type ClassDetailsFormInput = z.input<typeof classDetailsSchema>;
export type ClassDetailsFormData = z.infer<typeof classDetailsSchema>;
