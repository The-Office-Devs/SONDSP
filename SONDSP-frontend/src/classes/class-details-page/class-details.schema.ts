import { z } from "zod/v4";

export const classDetailsSchema = z.object({
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
  applicationPeriod: z
    .string()
    .optional()
    .transform((v) => v || undefined)
}).refine(
  (data) => !data.subjectId || !!data.strandId,
  {
    message: "Selecione o eixo",
    path: ["strandId"],
  }
);

export type ClassDetailsFormInput = z.input<typeof classDetailsSchema>;
export type ClassDetailsFormData = z.infer<typeof classDetailsSchema>;
