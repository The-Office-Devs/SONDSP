import { z } from "zod/v4";

export const surveySchema = z.object({
  schoolId: z.coerce
    .number()
    .int()
    .positive("Selecione uma escola"),
  schoolClassId: z.coerce
    .number()
    .int()
    .positive("Selecione uma turma")
});

export type SurveyFormInput = z.input<typeof surveySchema>
export type SurveyFormData = z.infer<typeof surveySchema>